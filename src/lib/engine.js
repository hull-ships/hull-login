import _ from 'underscore';
import assign from 'object-assign';
import { EventEmitter } from 'events';
import * as shopiform from './shopiform';

const USER_SECTIONS = [
  'showProfile',
  'editProfile',
  'thanks'
];

const VISITOR_SECTIONS = [
  'logIn',
  'signUp',
  'resetPassword'
];

const SECTIONS = USER_SECTIONS.concat(VISITOR_SECTIONS);

const ACTIONS = [
  'showDialog',
  'hideDialog',
  'signUp',
  'logIn',
  'logOut',
  'linkIdentity',
  'unlinkIdentity',
  'resetPassword',
  'updateUser',
  'activateLogInSection',
  'activateSignUpSection',
  'activateResetPasswordSection',
  'activateShowProfileSection',
  'activateEditProfileSection',
  'updateCurrentEmail'
];

const METHODS = {
  login: 'logIn',
  logout: 'logOut',
  signup: 'signUp'
};

const STATUS = {
  logIn: 'isLoggingIn',
  logOut: 'isLoggingOut',
  linkIdentity: 'isLinking',
  unlinkIdentity: 'isUnlinking'
};

const EVENT = 'CHANGE';

const STORAGE_KEY = 'hull-login';

function Engine(deployment) {
  this._ship = deployment.ship;
  this._platform = deployment.platform;
  this._settings = deployment.settings;
  this._organization = deployment.organization;
  this._form = this._ship.resources.profile_form;

  this.resetState();
  this.resetUser();
  Hull.on('hull.user.**', (user) => {
    // Ignore the events that come from actions.
    if (this.isWorking()) { return; }

    let nextUser = user || {};
    let previousUser = this._user || {};

    if (nextUser.id !== previousUser.id) { this.fetchShip(); }
  });

  _.each(this.getActions(), function(a, k) {
    Hull.on('hull.login.' + k, a);
  });

  this.emitChange();

  let savedState = this.getSavedState();
  const showSignUpSection = !savedState.returningUser && !savedState.dialogHidden;
  const t = this._ship.settings.show_sign_up_section_after;
  if (showSignUpSection && t > 0) { this.showLater(t, 'signUp'); }
}

Engine.prototype = assign({}, EventEmitter.prototype, {

  getActions() {
    if (this._actions) { return this._actions; }

    this._actions = ACTIONS.reduce((m, a) => {
      m[a] = this[a].bind(this);
      return m;
    }, {});

    return this._actions;
  },

  getState() {
    return {
      user: this._user,
      settings: this._settings,
      shipSettings: this._ship.settings,
      organization: this._organization,
      platform: this._platform,
      ship: this._ship,
      form: this._form,
      formIsSubmitted: this.formIsSubmitted(),
      hasForm: this.hasForm(),
      identities: this._identities,
      providers: this.getProviders(),
      errors: this._errors,
      isWorking: this.isWorking(),
      isLoggingIn: this._isLoggingIn,
      isLoggingOut: this._isLoggingOut,
      isLinking: this._isLinking,
      isUnlinking: this._isUnlinking,
      dialogIsVisible: this._dialogIsVisible,
      activeSection: this.getActiveSection(),
      currentEmail: this._currentEmail
    };
  },

  addChangeListener(listener) {
    this.addListener(EVENT, listener);
  },

  removeChangeListener(listener) {
    this.removeListener(EVENT, listener);
  },

  emitChange() {
    this.emit(EVENT);
  },

  saveState(attrs) {
    let state = assign({}, this.getSavedState(), attrs);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  },

  getSavedState() {
    let state = {};
    let val = window.localStorage.getItem(STORAGE_KEY);
    if (val) {
      try {
        state = JSON.parse(val);
      } catch(err) {
        state = {};
      }
      if (!state || (typeof state !== 'object')) {
        state = {};
      }
    }
    return state || {};
  },

  resetState() {
    this.resetUser();

    this._errors = {};
    this._isLoggingIn = false;
    this._isLoggingOut = false;
    this._isLinking = false;
    this._isUnlinking = false;
    this._dialogIsVisible = false;
    this._activeSection = 'logIn';

    let savedState = this.getSavedState();
    this._currentEmail = savedState.currentEmail;
    this._returningUser = savedState.returningUser;
  },

  resetUser() {
    this._user = Hull.currentUser();

    let identities = {};
    if (this._user != null) {
      this.saveState({ returningUser: true });
      this.updateCurrentEmail(this._user.email);
      this._user.identities.forEach(function(identity) {
        identities[identity.provider] = true;
      });
    }

    this._identities = identities;
  },

  fetchShip() {
    // As today Hull.api calls cannot be aborted... So I set an ID to every
    // fetchShip calls to be sure to execute the callback only when the last
    // Hull.api call is resolved.
    let id = (this._fetchShipPromiseId || 0) + 1;
    this._fetchShipPromiseId = id;

    return Hull.api(this._ship.id).then((ship) => {
      if (id !== this._fetchShipPromiseId) { return; }

      this._ship = ship;
      this._form = this._ship.resources.profile_form;

      this.resetUser();
      this.emitChange();
    });
  },

  getProviders() {
    let providers = [];

    const services = Hull.config().services.auth;

    for (let k in services) {
      if (services.hasOwnProperty(k) && k !== 'hull') {
        let provider = { name: k };
        provider.isLinked = !!this._identities[k];
        provider.isUnlinkable = provider.isLinked && this._user.main_identity !== k;

        providers.push(provider);
      }
    }

    return providers;
  },

  getActiveSection() {
    let sections;
    let defaultSection;

    if (this._user) {
      if (this.hasForm() && !this.formIsSubmitted()) { return 'editProfile'; }

      sections = USER_SECTIONS;
      defaultSection = 'showProfile';
    } else {
      sections = VISITOR_SECTIONS;
      defaultSection = sections[0];
    }

    return sections.indexOf(this._activeSection) > -1 ? this._activeSection : defaultSection;
  },

  showDialog() {
    let section = this._returningUser ? 'logIn' : 'signUp';
    return this.activateSection(section);
  },

  hideDialog() {
    this.saveState({ dialogHidden: true });

    this.clearTimers();

    if (this._redirectLater) {
      this.redirect();
    }

    this._dialogIsVisible = false;
    this._activeSection = null;

    this.emitChange();
  },

  signUp(credentials) {
    return this.perform('signup', credentials).then(() => {
      return this.fetchShip().then(() => {
        this._redirectLater = true;

        if (!this.hasForm()) {
          this.activateThanksSectionAndHideLater();
        }
      });
    });
  },

  logIn(providerOrCredentials) {
    return this.perform('login', providerOrCredentials).then((user) => {
      return this.fetchShip().then(() => {
        let userIsNew = user.created_at === user.updated_at && user.stats.sign_in_count <= 1;
        let hasForm = this.hasForm();

        if (!hasForm && userIsNew) {
          this._redirectLater = true;
          this.activateThanksSectionAndHideLater();
        } else if (!hasForm || this.formIsSubmitted()) {
          this.redirect();
        } else {
          this._redirectLater = true;
        }
      });
    });
  },

  logOut() {
    return Hull.logout().then(() => {
      this.resetUser();
      this.emitChange();

      this.fetchShip();
    });
  },

  linkIdentity(provider) {
    return this.perform('linkIdentity', provider).then(() => {
      this.resetUser();
      this.emitChange();
    });
  },

  unlinkIdentity(provider) {
    return this.perform('unlinkIdentity', provider).then(() => {
      this.resetUser();
      this.emitChange();
    });
  },

  perform(method, provider) {
    let options;
    if (typeof provider === 'string') {
      options = { provider: provider };
    } else {
      options = assign({}, provider);
      provider = 'classic';
    }

    const s = STATUS[METHODS[method]];

    this['_' + s] = provider;
    this._errors = {};

    this.emitChange();

    let promise;
    if (this.isShopifyCustomer()) {
      if (provider === 'classic') {
        // For shopify platforms we use a custom endpoints that create a user
        // and a customer at the same time.
        let url = 'services/shopify/customers';
        if (method === 'login') { url += '/login'; }

        let c = { email: options.email || options.login, password: options.password };
        promise = Hull.api(url, c, 'post').then((user) => {
          return shopiform.logIn(c).then(() => { return user; });
        });
      } else {
        options.redirect_url = document.location.origin + '/a/hull-callback';
      }
    }

    if (promise == null) {
      promise = Hull[method](options);
    }

    promise.then(() => {
      this['_' + s] = false;
      this._errors = {};

      this.emitChange();
    }, (error) => {
      this['_' + s] = false;

      error.provider = provider;
      let m = METHODS[method] || method;
      this._errors[m] = error;

      this.emitChange();
    });

    return promise;
  },

  resetPassword(email) {
    let r;
    this._errors.resetPassword = null;
    this.emitChange();

    if (this.isShopifyCustomer()) {
      r = shopiform.resetPassword({ email });
      r.catch((err)=> {
        this._errors.resetPassword = err;
        this.emitChange();
      });
    } else {
      r = Hull.api('/users/request_password_reset', 'post', { email });
      r.catch((error) => {
        let err;
        if (error && error.status) {
          switch (error.status) {
            case 429:
              err = new Error('reset password too many requests error');
              break;
            case 404:
              err = new Error('reset password invalid email error');
              break;
            default:
              err = new Error('reset password invalid email error');
              break;
          }
          this._errors.resetPassword = err;
        } else {
          this._errors.resetPassword = error;
        }
        this.emitChange();
      });
    }


    return r;
  },

  updateUser(value) {
    let formWasSubmitted = this.formIsSubmitted();

    let user = _.reduce(['name', 'email', 'password', 'first_name', 'last_name'], (m, k) => {
      let v = value[k];
      if (typeof v === 'string' && v.trim() !== '') { m[k] = v; }

      return m;
    }, {});

    let data = _.reduce(this._form.fields_list, (m, { name }) => {
      let v = value[name];
      if (v != null) { m[name] = v; }

      return m;
    }, {});

    let promises = [];
    if (_.size(user)) {
      let promise = Hull.api(this._user.id, 'put', user).then((r) => {
        this._user = r;
      });
      promises.push(promise);
    }
    if (_.size(data)) {
      let promise = Hull.api(this._form.id + '/submit', 'put', { data }).then((r) => {
        this._form = r;
      });
      promises.push(promise);
    }

    let r = Promise.all(promises).then(() => {
      if (formWasSubmitted) {
        this.activateShowProfileSection();
      } else {
        this.activateThanksSectionAndHideLater();
      }

      this._errors.updateUser = null;
      this.emitChange();
    }, (error) => {
      this._errors.updateUser = error;
      this.emitChange();
    });

    return r;
  },

  redirect() {
    this._redirectLater = false;

    let location = this._settings.redirect_url;
    if (this.isShopifyCustomer()) {
      location = location || document.location.href;
    }

    if (location == null) { return; }

    if (document.location.href === location) {
      window.location.reload();
    } else {
      document.location.href = location;
    }
  },

  updateCurrentEmail(value) {
    if (/@/.test(value)) {
      this._currentEmail = value;
      this.saveState({ currentEmail: value });
    }
  },

  activateLogInSection() {
    this.activateSection('logIn');
  },

  activateSignUpSection() {
    this.activateSection('signUp');
  },

  activateResetPasswordSection() {
    this.activateSection('resetPassword');
  },

  activateShowProfileSection() {
    this.activateSection('showProfile');
  },

  activateEditProfileSection() {
    this.activateSection('editProfile');
  },

  activateSection(name) {
    this.clearTimers();

    if (SECTIONS.indexOf(name) > -1) {
      this._dialogIsVisible = true;
      this._activeSection = name;
      this._errors = {};
      this.emitChange();
    } else {
      throw new Error('"' + name + '" is not a valid section name');
    }
  },

  activateThanksSectionAndHideLater() {
    if (!this._ship.settings.show_thanks_section_after_sign_up) {
      return this.hideDialog();
    }

    this._activeSection = 'thanks';
    this.emitChange();

    let t = this._ship.settings.hide_thanks_section_after;

    if (t > 0) { this.hideLater(t); }
  },

  showLater(time, name) {
    this.clearTimers();

    this._showLaterTimer = setTimeout(() => {
      this._dialogIsVisible = true;
      this._activeSection = name;

      this.emitChange();
    }, time * 1000);
  },

  hideLater(time) {
    this.clearTimers();

    this._hideLaterTimer = setTimeout(() => {
      this.hideDialog();
    }, time * 1000);
  },

  clearTimers() {
    clearTimeout(this._hideLaterTimer);
    clearTimeout(this._showLaterTimer);
  },

  hasForm() {
    return this._form && this._form.fields_list.length > 0;
  },

  formIsSubmitted() {
    return this._form.user_data && !!this._form.user_data.created_at;
  },

  isWorking() {
    return this._isLoggingIn || this._isLoggingOut || this._isLinking || this._isUnlinking;
  },

  isShopifyCustomer() {
    return this._platform.type === 'platforms/shopify_shop' && Hull.config().customerId !== 'disabled';
  }
});

export default Engine;
