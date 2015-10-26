import _ from 'lodash';
import assign from 'object-assign';
import { EventEmitter } from 'events';
import * as Backends from './backends';
import I18n from '../i18n';

const USER_SECTIONS = [
  'showProfile',
  'editProfile',
  'thanks',
];

const VISITOR_SECTIONS = [
  'logIn',
  'signUp',
  'resetPassword',
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
  'updateCurrentEmail',
];

const STATUS = {
  logIn: 'isLoggingIn',
  signUp: 'isLoggingIn',
  logOut: 'isLoggingOut',
  linkIdentity: 'isLinking',
  unlinkIdentity: 'isUnlinking',
};

const EVENT = 'CHANGE';

const STORAGE_KEY = 'hull-login';

let isLocalStorageSupported;

export default class Engine extends EventEmitter {

  constructor(deployment, hull) {
    super();
    this._hull = hull;
    this._ship = deployment.ship;
    this._platform = deployment.platform;
    this._settings = deployment.settings;
    this._organization = deployment.organization;
    this._form = this._ship.resources.profile_form;

    this.resetState();
    this.resetUser();
    this._hull.on('hull.user.**', (user) => {
      // Ignore the events that come from actions.
      if (this.isWorking()) { return; }

      const nextUser = user || {};
      const previousUser = this._user || {};

      if (nextUser.id !== previousUser.id) { this.fetchShip(); }
    });

    _.each(this.getActions(), (a, k) => {
      this._hull.on('hull.login.' + k, (options) => {
        this._transientOptions = options;
        a();
      });
    });
    this.updateTranslations();
    this.emitChange();

    const savedState = this.getSavedState();
    if (savedState.completeSignup && !this.formIsSubmitted()) {
      this.showLater(1, 'editProfile');
    } else {
      const showSignUpSection = !savedState.returningUser && !savedState.dialogHidden;
      const t = this._ship.settings.show_sign_up_section_after;
      if (showSignUpSection && t > 0) {
        this.showLater(t, 'signUp');
      }
    }
  }

  updateTranslations() {
    I18n.setTranslations(this._ship.translations);
  }

  getActions() {
    if (this._actions) { return this._actions; }

    this._actions = ACTIONS.reduce((m, a) => {
      m[a] = this[a].bind(this);
      return m;
    }, {});

    return this._actions;
  }

  updateShip(ship) {
    this._ship = ship;
    this.updateTranslations();
    this.emitChange();
  }

  getState() {
    return {
      user: this._user,
      profileData: this.getProfileData(),
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
      currentEmail: this._currentEmail,
      isShopifyCustomer: this.isShopifyCustomer(),
    };
  }

  addChangeListener(listener) {
    this.addListener(EVENT, listener);
  }

  removeChangeListener(listener) {
    this.removeListener(EVENT, listener);
  }

  emitChange() {
    this.emit(EVENT);
  }

  getStorageKey() {
    return [STORAGE_KEY, this._ship.id].join('-');
  }

  saveState(attrs) {
    const state = _.reduce(attrs, (s, v, k)=> {
      if (v === null && s.hasOwnProperty(k)) {
        delete s[k];
      } else {
        s[k] = v;
      }
      return s;
    }, this.getSavedState());

    if (isLocalStorageSupported !== false) {
      try {
        window.localStorage.setItem(this.getStorageKey(), JSON.stringify(state));
      } catch (err) {
        isLocalStorageSupported = false;
      }
    }
    return state;
  }

  getSavedState() {
    let state = {};
    const val = window.localStorage.getItem(this.getStorageKey());
    if (val) {
      try {
        state = JSON.parse(val);
      } catch (err) {
        state = {};
      }
      if (!state || (typeof state !== 'object')) {
        state = {};
      }
    }
    return state || {};
  }

  resetState() {
    this.resetUser();

    this._errors = {};
    this._isLoggingIn = false;
    this._isLoggingOut = false;
    this._isLinking = false;
    this._isUnlinking = false;
    this._dialogIsVisible = false;
    this._activeSection = 'logIn';

    const savedState = this.getSavedState();
    this._currentEmail = savedState.currentEmail;
    this._returningUser = savedState.returningUser;
  }

  resetUser() {
    this._user = Hull.currentUser();

    const identities = {};
    if (!!this._user) {
      this.saveState({ returningUser: true });
      this._user.identities.forEach(function(identity) {
        identities[identity.provider] = true;
      });
    }

    this._identities = identities;
  }

  fetchShip() {
    // As today Hull.api calls cannot be aborted... So I set an ID to every
    // fetchShip calls to be sure to execute the callback only when the last
    // Hull.api call is resolved.
    const id = (this._fetchShipPromiseId || 0) + 1;
    this._fetchShipPromiseId = id;

    return Hull.api(this._ship.id).then((ship) => {
      if (id !== this._fetchShipPromiseId) {
        return;
      }

      this._ship = ship;
      this._form = this._ship.resources.profile_form;

      this.resetUser();
      this.emitChange();
    }).catch(function(e) {
      throw new Error('Error Fetching Ship', e);
    });
  }

  getProviders() {
    const providers = [];

    const services = Hull.config().services.auth;

    for (const k in services) {
      if (services.hasOwnProperty(k) && k !== 'hull') {
        const provider = { name: k };
        provider.isLinked = !!this._identities[k];
        provider.isUnlinkable = provider.isLinked && this._user.main_identity !== k;

        providers.push(provider);
      }
    }

    return providers;
  }

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
  }

  showDialog() {
    const section = this._returningUser ? 'logIn' : 'signUp';
    return this.activateSection(section);
  }

  hideDialog() {
    this.saveState({ dialogHidden: true, completeSignup: null });

    this.clearTimers();

    if (this._redirectLater) {
      this.redirect();
    }

    this._dialogIsVisible = false;
    this._activeSection = null;

    this._transientOptions = {};
    this.emitChange();
  }

  signUp(credentials) {
    this.saveState({ completeSignup: true });
    return this.perform('signUp', credentials).then(() => {
      return this.fetchShip().then(() => {
        this._redirectLater = true;

        if (!this.hasForm()) {
          this.activateThanksSectionAndHideLater();
        } else {
          this.redirect();
        }
      });
    });
  }

  logIn(providerOrCredentials) {
    return this.perform('logIn', providerOrCredentials).then((user) => {
      return this.fetchShip().then(() => {
        const userIsNew = user.created_at === user.updated_at && user.stats.sign_in_count <= 1;
        const hasForm = this.hasForm();

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
  }

  logOut(options) {
    return this.perform('logOut', options).then(() => {
      this.resetUser();
      this.emitChange();

      this.fetchShip();
    });
  }

  linkIdentity(provider) {
    return this.perform('linkIdentity', provider).then(() => {
      this.resetUser();
      this.emitChange();
    });
  }

  unlinkIdentity(provider) {
    return this.perform('unlinkIdentity', provider).then(() => {
      this.resetUser();
      this.emitChange();
    });
  }

  getBackend() {
    let backend;
    switch (this._platform && this._platform.type) {
    case 'platforms/shopify_shop':
      backend = Backends.shopify;
      break;
    default:
      backend = Backends.hull;
      break;
    }
    return backend;
  }

  getBackendMethod(method) {
    return this.getBackend()[method] || Hull[method] || (()=> { throw new Error('Unknow method ' + method); });
  }

  perform(method, provider) {
    const statusKey = !!STATUS[method] && ('_' + STATUS[method]);
    const { Promise } = Hull.utils;
    let options = assign({}, this._transientOptions);

    if (!statusKey) {
      return Promise.reject('Unknown method ' + method);
    }

    if (typeof provider === 'string') {
      options = assign(options, { provider });
    } else {
      options = assign(options, provider);
      provider = 'classic';
    }

    this[statusKey] = provider;
    this._errors = {};

    this.emitChange();

    const fn = this.getBackendMethod(method);
    const promise = fn(options);

    if (promise && promise.then) {
      promise.then((user) => {
        if (provider === 'classic' && user && user.email) {
          this.updateCurrentEmail(user.email, true);
        }

        this[statusKey] = false;
        this._errors = {};

        this.emitChange();
      }, (error) => {
        this[statusKey] = false;

        error.provider = provider;
        this._errors[method] = error;

        this.emitChange();
      });
    }

    return promise;
  }

  resetPassword(email) {
    this._errors.resetPassword = null;
    this.emitChange();

    const fn = this.getBackendMethod('resetPassword');
    const ret = fn(email);

    ret.catch((error)=> {
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
    return ret;
  }

  updateUser(value) {
    const formWasSubmitted = this.formIsSubmitted();

    const user = _.reduce(['name', 'email', 'password', 'first_name', 'last_name'], (m, k) => {
      const v = value[k];
      if (typeof v === 'string' && v.trim() !== '') { m[k] = v; }

      return m;
    }, {});

    const data = _.reduce(this._form.fields_list, (m, { name }) => {
      const v = value[name];
      if (!!v) { m[name] = v; }

      return m;
    }, {});

    const promises = [];
    if (_.size(user)) {
      const promise = Hull.api(this._user.id, 'put', user).then((r) => {
        this._user = r;
      });
      promises.push(promise);
    }
    if (_.size(data)) {
      const promise = Hull.api(this._form.id + '/submit', 'put', { data }).then((r) => {
        this._form = r;
      });
      promises.push(promise);
    }

    const r = Promise.all(promises).then(() => {
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
  }

  redirect() {
    this._redirectLater = false;

    const options = assign({}, this._settings, this._transientOptions || {});

    let location = options.redirect_url;

    if (this.isShopifyCustomer()) {
      location = location || document.location.href;
    }

    if (!location) { return; }

    if (document.location.href === location) {
      window.location.reload();
    } else {
      document.location.href = location;
    }
  }

  updateCurrentEmail(value, saveIt = false) {
    if (/@/.test(value)) {
      this._currentEmail = value;
      if (saveIt) {
        this.saveState({ currentEmail: value });
      }
    }
  }

  activateLogInSection() {
    this.activateSection('logIn');
  }

  activateSignUpSection() {
    this.activateSection('signUp');
  }

  activateResetPasswordSection() {
    this.activateSection('resetPassword');
  }

  activateShowProfileSection() {
    this.activateSection('showProfile');
  }

  activateEditProfileSection() {
    this.activateSection('editProfile');
  }

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
  }

  activateThanksSectionAndHideLater() {
    if (!this._ship.settings.show_thanks_section_after_sign_up) {
      return this.hideDialog();
    }

    this._activeSection = 'thanks';
    this.emitChange();

    const t = this._ship.settings.hide_thanks_section_after;

    if (t > 0) { this.hideLater(t); }
  }

  showLater(time, name) {
    this.clearTimers();

    this._showLaterTimer = setTimeout(() => {
      this._dialogIsVisible = true;
      this._activeSection = name;

      this.emitChange();
    }, time * 1000);
  }

  hideLater(time) {
    this.clearTimers();

    this._hideLaterTimer = setTimeout(() => {
      this.hideDialog();
    }, time * 1000);
  }

  clearTimers() {
    clearTimeout(this._hideLaterTimer);
    clearTimeout(this._showLaterTimer);
  }

  hasForm() {
    return this._form && this._form.fields_list.length > 0;
  }

  formIsSubmitted() {
    return this._form.user_data && !!this._form.user_data.created_at;
  }

  isWorking() {
    return !!(this._isLoggingIn || this._isLoggingOut || this._isLinking || this._isUnlinking);
  }

  getProfileData() {
    const user = this._user;
    const formData = user && this._form && this._form.user_data && this._form.user_data.data;
    if (!user) return false;
    return assign(
      user.extra,
      formData,
      _.pick(this._user, 'id', 'name', 'first_name', 'last_name', 'email', 'address')
    );
  }

  isShopifyCustomer() {
    return this._platform.type === 'platforms/shopify_shop' && Hull.config().customerId !== 'disabled';
  }

}
