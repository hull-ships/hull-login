import React from 'react';
import _ from 'lodash';
import cssModules from 'react-css-modules';
import styles from './page-buttons.css';
import TranslatedMessage from '../translated-message';

const PageButtons = React.createClass({

  propTypes: {
    actions: React.PropTypes.object.isRequired,
    hasForm: React.PropTypes.bool,
    formIsSubmitted: React.PropTypes.bool,
    shipSettings: React.PropTypes.object.isRequired,
    user: React.PropTypes.object,
    styles: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      shipSettings: {},
    };
  },

  callAction(action) {
    return (e)=> {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      const fn = this.props.actions[action];
      if (fn) {
        return fn.call(this);
      }
    };
  },

  hasUser() {
    return !!this.props.user;
  },
  canLogout() {
    return this.hasUser();
  },
  canLogin() {
    return !this.hasUser() && this.props.shipSettings.show_login;
  },
  canSignup() {
    return !this.hasUser() && this.props.shipSettings.show_signup;
  },
  needsMoreData() {
    return this.hasUser() && this.props.shipSettings.show_profile && this.props.hasForm && !this.props.formIsSubmitted;
  },
  canSeeProfile() {
    return this.hasUser() && !this.needsMoreData();
  },

  renderLoginButton() {
    if (!this.canLogin()) { return null; }
    return (
      <TranslatedMessage tag="a"
        href="#"
        key="log-in"
        styleName="log-in"
        onClick={this.callAction('activateLogInSection')}
        message="nav login link" />
    );
  },
  renderSignupButton() {
    if (!this.canSignup()) { return null; }
    return (
      <TranslatedMessage tag="a"
        href="#"
        key="sign-up"
        styleName="sign-up"
        onClick={this.callAction('activateSignUpSection')}
        message="nav sign-up link" />
    );
  },
  renderCompleteProfileButton() {
    if (!this.needsMoreData()) { return null; }
    return (
      <TranslatedMessage tag="a"
        href="#"
        key="complete-profile"
        styleName="edit-profile"
        onClick={this.callAction('activateEditProfileSection')}
        message="nav complete profile link" />
    );
  },
  renderProfileButton() {
    if (!this.canSeeProfile()) { return null; }
    const u = this.props.user;
    return (
      <a href="#"
        key="show-profile"
        styleName="show-profile"
        onClick={this.callAction('activateShowProfileSection')}>{u.name || u.username || u.email}</a>
    );
  },
  renderLogoutButton() {
    if (!this.canLogout()) { return null; }
    return (
      <TranslatedMessage tag="a"
        href="#"
        key="log-out"
        styleName="log-out"
        onClick={this.callAction('logOut')}
        message="nav logout link" />
    );
  },
  renderCustomButtons() {
    if (!this.props.shipSettings.custom_buttons.length) { return null; }
    return _.map(this.props.shipSettings.custom_buttons, function(value, i) {
      const { url, popup, text } = value;
      return (
        <a href={url}
          key={`custom-action-${i}`}
          target={popup ? '_blank' : ''}
          styleName="custom">{text}</a>
      );
    });
  },

  render() {
    return (
      <span>
        {this.renderLoginButton()}
        {this.renderSignupButton()}

        {this.renderCompleteProfileButton()}
        {this.renderProfileButton()}
        {this.renderLogoutButton()}

        {this.renderCustomButtons()}
      </span>
    );
  },

});

export default cssModules(PageButtons, styles);
