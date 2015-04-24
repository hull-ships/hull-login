import assign from 'object-assign';
import { EventEmitter } from 'events';
import IntlMessageFormat from 'intl-messageformat';

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
  'updateProfile',

  'activateLogInSection',
  'activateSignUpSection',
  'activateResetPasswordSection',
  'activateShowProfileSection',
  'activateEditProfileSection'
];

const STATUS = {
  login: 'isLogingIn',
  logout: 'isLogingOut',
  logIn: 'isLogingIn',
  logOut: 'isLogingOut',
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
    let nextUser = user || {};
    let previousUser = this._user || {};

    if (nextUser.id !== previousUser.id) { this.reboot(); }
  });

  this.emitChange();
}

assign(Engine.prototype, EventEmitter.prototype, {
  getActions: function() {
    if (this._actions) { return this._actions; }

    var instance = this;
    this._actions = ACTIONS.reduce(function(m, a) {
      m[a] = instance[a].bind(instance);
      return m;
    }, {});

    return this._actions;
  },

  getState: function() {
    return {
      user: this._user,
      settings: this._settings,
      shipSettings: this._ship.settings,
      organization: this._organization,
      platform: this._platform,
      ship: this._ship,
      form: this._form,
      formIsSubmitted: this.formIsSubmitted(),
      identities: this._identities,
      providers: this.getProviders(),
      error: this._error,
      isWorking: this._isLogingIn || this._isLogingOut || this._isLinking || this._isUnlinking,
      isLogingIn: this._isLogingIn,
      isLogingOut: this._isLogingOut,
      isLinking: this._isLinking,
      isUnlinking: this._isUnlinking,
      dialogIsVisible: this._dialogIsVisible,
      activeSection: this.getActiveSection()
    };
  },

  addChangeListener: function(listener) {
    this.addListener(EVENT, listener)
  },

  removeChangeListener: function(listener) {
    this.removeListener(EVENT, listener);
  },

  emitChange: function() {
    this.emit(EVENT);
  },

  resetState: function() {
    this.resetUser();

    this._error = null;
    this._isLogingIn = false;
    this._isLogingOut = false;
    this._isLinking = false;
    this._isUnlinking = false;
    this._dialogIsVisible = false;
    this._activeSection = 'logIn';
  },

  resetUser: function() {
    this._user = Hull.currentUser();

    var identities = {}
    if (this._user != null) {
      this._user.identities.forEach(function(identity) {
        identities[identity.provider] = true;
      });
    }

    this._identities = identities;
  },

  resetShip() {
    return Hull.api(this._ship.id).then((ship) => {
      this._ship = ship;
      this._form = this._ship.resources.profile_form;

      this.resetUser();
      this.emitChange();
    });
  },

  reboot() {
    this.resetUser();
    this.emitChange();
    this.resetShip()
  },

  getProviders: function() {
    var providers = [];

    var services = Hull.config().services.auth;

    for (var k in services) {
      if (services.hasOwnProperty(k) && k !== 'hull') {
        var provider = { name: k };
        provider.isLinked = !!this._identities[k];
        provider.isUnlinkable = provider.isLinked && this._user.main_identity !== k;

        providers.push(provider);
      }
    }

    return providers;
  },

  getActiveSection: function() {
    let sections;
    let defaultSection;

    if (this._user) {
      if (!this.formIsSubmitted()) { return 'editProfile'; }

      sections = USER_SECTIONS;
      defaultSection = 'showProfile';
    } else {
      sections = VISITOR_SECTIONS;
      defaultSection = sections[0];
    }

    return sections.indexOf(this._activeSection) > -1 ? this._activeSection : defaultSection;
  },

  showDialog: function() {
    this._dialogIsVisible = true;
    this.emitChange();
  },

  hideDialog: function() {
    this._dialogIsVisible = false;
    this.emitChange();
  },

  signUp: function(credentials) {
    return this.performAndRedirect('signup', credentials);
  },

  logIn: function(providerOrCredentials) {
    return this.performAndRedirect('login', providerOrCredentials);
  },

  logOut: function() {
    return Hull.logout().then(() => { this.reboot(); });
  },

  linkIdentity: function(provider) {
    return this.perform('linkIdentity', provider);
  },

  unlinkIdentity: function(provider) {
    return this.perform('unlinkIdentity', provider);
  },

  performAndRedirect: function(action, provider) {
    let p = this.perform(action, provider);

    let location = this._settings.redirect_url;
    if (this.isShopify()) {
      location = location || '/account';
    }
    if (location) {
      p.done(function() { document.location = location; });
    }

    return p.then((user) => { return this.resetShip(); });
  },

  perform: function(method, provider) {
    var s = STATUS[method];
    var options;

    if (typeof provider === 'string') {
      options = { provider: provider };
    } else {
      options = provider;
      provider = 'classic';
    }

    this['_' + s] = provider;
    this._error = null;

    this.emitChange();

    if (this.isShopify()) {
      var proxy = document.location.origin + '/a/hull-callback';
      proxy += this._settings.redirect_url ? '?redirect_url=' + this._settings.redirect_url : '';

      options.redirect_url = proxy;
    }

    var promise = Hull[method](options);

    var instance = this;
    function onSuccess() {
      instance.resetUser();

      instance['_' + s] = false;
      instance._error = null;

      instance.emitChange();
    }
    function onFailure(error) {
      instance['_' + s] = false;

      error.provider = provider;
      instance._error = error;

      instance.emitChange();
    }
    promise.then(onSuccess, onFailure);

    return promise;
  },

  resetPassword: function(email) {
    return Hull.api('/users/request_password_reset', 'post', { email });
  },

  updateProfile: function(profile) {
    let r = Hull.api(this._form.id + '/submit' ,'put', { data: profile });
    const showThanksSection = !this.formIsSubmitted();

    r.then((form) => {
      this._form = form;

      // TODO show thanks section after complete registration flow
      //this._activeSection = showThanksSection ? 'thanks' : 'showProfile';
      if (showThanksSection) {
        this._dialogIsVisible = false;
        this._activeSection = null;
      } else {
        this._activeSection = 'showProfile';
      }

      this.emitChange();
    });

    return r;
  },

  activateLogInSection: function() {
    this.activateSection('logIn');
  },

  activateSignUpSection: function() {
    this.activateSection('signUp');
  },

  activateResetPasswordSection: function() {
    this.activateSection('resetPassword');
  },

  activateShowProfileSection: function() {
    this.activateSection('showProfile');
  },

  activateEditProfileSection: function() {
    this.activateSection('editProfile');
  },

  activateSection: function(name) {
    if (SECTIONS.indexOf(name) > -1) {
      this._dialogIsVisible = true;
      this._activeSection = name;
      this.emitChange();
    } else {
      throw new Error('"' + name + '" is not a valid section name');
    }
  },

  formIsSubmitted() {
    return this._form.user_data && !!this._form.user_data.created_at;
  },

  isShopify: function() {
    return this._platform.type === 'platforms/shopify';
  }
});

module.exports = Engine;

