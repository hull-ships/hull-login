/* global Hull */
'use strict';

import _ from 'underscore';
import assign from 'object-assign';
import { EventEmitter } from 'events';

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
  'updatePicture',
  'updateUser',

  'activateLogInSection',
  'activateSignUpSection',
  'activateResetPasswordSection',
  'activateShowProfileSection',
  'activateEditProfileSection'
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

  this.emitChange();

  const showSignUpSection = Hull.utils.cookies(this.getCookieKey('shown')) !== 'true';
  const t = this._ship.settings.show_sign_up_section_after;
  if (showSignUpSection && t > 0) { this.showLater(t, 'signUp'); }
}

assign(Engine.prototype, EventEmitter.prototype, {
  getCookieKey(key) {
    return this._ship.id + key;
  },

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
      activeSection: this.getActiveSection()
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

  resetState() {
    this.resetUser();

    this._errors = {};
    this._isLoggingIn = false;
    this._isLoggingOut = false;
    this._isLinking = false;
    this._isUnlinking = false;
    this._dialogIsVisible = false;
    this._activeSection = 'logIn';
  },

  resetUser() {
    this._user = Hull.currentUser();

    let identities = {};
    if (this._user != null) {
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
    this.clearTimers();

    this._dialogIsVisible = true;
    this.emitChange();
  },

  hideDialog() {
    Hull.utils.cookies(this.getCookieKey('shown'), true);

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
        if (!this.hasForm()) {
          this._redirectLater = true;
          this.activateThanksSectionAndHideLater();
        }
      });
    });
  },

  logIn(providerOrCredentials) {
    return this.perform('login', providerOrCredentials).then((user) => {
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

    if (this.isShopifyCustomer()) {
      options.redirect_url = document.location.origin + '/a/hull-callback';
    }

    let promise = Hull[method](options);

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
    let r = Hull.api('/users/request_password_reset', 'post', { email });

    r.catch((error) => {
      this._errors.resetPassword = error;

      this.emitChange();
    });

    return r;
  },

  updateUser(value) {
    let user = _.reduce(['name', 'email', 'password'], (m, k) => {
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
      if (this.formIsSubmitted()) {
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

  updatePicture(file) {
    return new Promise((resolve, reject) => {
      let s3config = Hull.config().services.storage.hull;

      let url = s3config.url;
      let type = file.type;
      let name = file.name;

      let form = new FormData();
      form.append('Content-Type', type);
      form.append('Filename', name);
      form.append('name', name);
      _.each(s3config.params, function(value, key) {
        form.append(key, value);
      });
      form.append('file', file);

      let req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.readyState === 4) {
          if (req.status === 201) {
            let picUrl = req.responseXML.getElementsByTagName('Location')[0].childNodes[0].nodeValue;
            Hull.api(this._user.id, 'put', { picture: picUrl }).then((resp) => {
              this.resetUser();
              // TODO Workaround currentUser not updating.
              this._user.picture = picUrl;
              this.emitChange();

              resolve(resp);
            }, (err) => {
              reject(err);
            });
          } else {
            /* eslint-disable no-console */
            console.error('Couldn\'t upload!');
            /* eslint-enable no-console */
            reject('Couldn\'t upload image, status ' + req.status);
          }
        }
      };
      req.open('post', url);
      req.send(form);
    });
  },

  redirect() {
    this._redirectLater = false;

    let location = this._settings.redirect_url;
    if (this.isShopifyCustomer()) {
      location = location || document.location.href;
    }

    if (location) { document.location = location; }
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
    this._activeSection = 'thanks';
    this.emitChange();

    const t = this._ship.settings.hide_thanks_section_after;

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

module.exports = Engine;
