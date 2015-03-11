import assign from 'object-assign';
import { EventEmitter } from 'events';
import IntlMessageFormat from 'intl-messageformat';
import constants from './constants';

const EVENT = 'CHANGE';

function Engine(deployment) {
  this._ship = deployment.ship;
  this._platform = deployment.platform;
  this._settings = deployment.settings;

  this.resetState();

  this.resetUser();
  Hull.on('hull.user.*', function() {
    this.resetUser()
    this.emitChange();
  }.bind(this));

  this.emitChange();
}

assign(Engine.prototype, EventEmitter.prototype, {
  getActions: function() {
    if (this._actions) { return this._actions; }

    var instance = this;
    this._actions = constants.ACTIONS.reduce(function(m, a) {
      m[a] = instance[a].bind(instance);
      return m;
    }, {});

    return this._actions;
  },

  getState: function() {
    return {
      user: this._user,
      identities: this._identities,
      providers: this.getProviders(),
      error: this._error,
      isWorking: this._isLogingIn || this._isLogingOut || this._isLinking || this._isUnlinking,
      isLogingIn: this._isLogingIn,
      isLogingOut: this._isLogingOut,
      isLinking: this._isLinking,
      isUnlinking: this._isUnlinking,
      dialogIsVisible: this._dialogIsVisible
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
    this.resetTranslations();
    this.resetUser();

    this._error = null;
    this._isLogingIn = false;
    this._isLogingOut = false;
    this._isLinking = false;
    this._isUnlinking = false;
    this._dialogIsVisible = false;
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

  resetTranslations: function() {
    this._locale = 'en';
    this._translations = {};

    var translations = this._ship.translations[this._locale];
    for (var k in translations) {
      if (translations.hasOwnProperty(k)) {
        this._translations[k] = new IntlMessageFormat(translations[k], this._locale);
      }
    }
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

  showDialog: function() {
    this._dialogIsVisible = true;
    this.emitChange();
  },

  hideDialog: function() {
    this._dialogIsVisible = false;
    this.emitChange();
  },

  login: function(provider) {
    var p = this.perform('login', provider);

    var location = this._settings.redirect_url;
    if (this.isShopify()) {
      location = location || '/account';
    }

    if (location) {
      p.done(function() { document.location = location; });
    }
  },

  logout: function() {
    Hull.logout();
  },

  linkIdentity: function(provider) {
    this.perform('linkIdentity', provider);
  },

  unlinkIdentity: function(provider) {
    this.perform('unlinkIdentity', provider);
  },

  perform: function(method, provider) {
    var s = constants.STATUS[method];

    this['_' + s] = provider;
    this._error = null;

    this.emitChange();

    var options = { provider: provider };

    if (this.isShopify()) {
      var proxy = document.location.origin + '/a/hull-callback';
      proxy += this._settings.redirect_url ? '?redirect_url=' + this._settings.redirect_url : '';

      options.redirect_url = proxy;
    }

    var promise = Hull[method](options);
    promise.then(function() {
      this.resetUser();

      this['_' + s] = false;
      this._error = null;

      this.emitChange();
    }.bind(this), function(error) {
      this['_' + s] = false;

      error.provider = provider;
      this._error = error;

      this.emitChange();
    }.bind(this));

    return promise;
  },

  translate: function(message, data) {
    var m = this._translations[message];

    if (m == null) { return; }

    return m.format(data);
  },

  isShopify: function() {
    return this._platform.type === 'platforms/shopify';
  }
});

module.exports = Engine;

