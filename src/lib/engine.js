import assign from 'object-assign';
import { EventEmitter } from 'events';
import IntlMessageFormat from 'intl-messageformat';
import constants from './constants';

const USER_SECTIONS = [
  'showProfile',
  'editProfile'
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
  'activateLogInSection',
  'activateSignUpSection',
  'activateResetPasswordSection',
  'activateShowProfileSection',
  'activateEditProfileSection'
];

const EVENT = 'CHANGE';

function Engine(deployment, organization) {
  this._ship = deployment.ship;
  this._platform = deployment.platform;
  this._settings = deployment.settings;
  this._organization = organization;

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
    var sections = this._user ? USER_SECTIONS : VISITOR_SECTIONS;

    return sections.indexOf(this._activeSection) > -1 ? this._activeSection : sections[0];
  },

  showDialog: function() {
    this._dialogIsVisible = true;
    this.showFullScreenModal();
    this.emitChange();
  },

  hideDialog: function() {
    this._dialogIsVisible = false;
    this.hideFullScreenModal();
    this.emitChange();
  },

  signUp: function(credentials) {
    this.performAndRedirect('signup', credentials);
  },

  logIn: function(providerOrCredentials) {
    this.performAndRedirect('login', providerOrCredentials);
  },

  logOut: function() {
    Hull.logout();
  },

  linkIdentity: function(provider) {
    this.perform('linkIdentity', provider);
  },

  unlinkIdentity: function(provider) {
    this.perform('unlinkIdentity', provider);
  },

  resetPassword: function(email) {
    // TODO : Jimmy -> Make this real
    console.log('RESET PASSWORD FOR ', email);
  },

  performAndRedirect: function(action, provider) {
    var p = this.perform(action, provider);

    var location = this._settings.redirect_url;
    if (this.isShopify()) {
      location = location || '/account';
    }

    if (location) {
      p.done(function() { document.location = location; });
    }

    return p;
  },

  setShipSize: function(){
    var self=this;
    // Automatically resize the frame to match the Ship Content
    // Call the method once to know if we're in a sandbox or not
    if(Hull.setShipSize()){
      setInterval(function(){
        if(!this._dialogIsVisible){
          var height = document.getElementById('ship').offsetHeight
          Hull.setShipSize({height:height});
        }
      } , 500)
    }
  },
  showFullScreenModal:function(){
    if(Hull && Hull.setShipStyle){
      Hull.setShipStyle({
        position:'fixed',
        top:0,
        left:0,
        right:0,
        bottom:0,
        zIndex: 1000
      });
    }
  },
  hideFullScreenModal: function(){
    if(Hull && Hull.setShipStyle){
      Hull.setShipStyle({
        position:"static",
        top:'auto',
        left:'auto',
        right:'auto',
        bottom:'auto',
        zIndex: 1
      });
    }
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

  perform: function(method, provider) {
    var s = constants.STATUS[method];
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

  activateSection: function(name) {
    if (SECTIONS.indexOf(name) > -1) {
      this._activeSection = name;
      this.emitChange();
    } else {
      throw new Error('"' + name + '" is not a valid section name');
    }
  },

  isShopify: function() {
    return this._platform.type === 'platforms/shopify';
  }
});

module.exports = Engine;

