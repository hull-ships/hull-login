'use strict';

import React from 'react';
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup';
import LayeredComponentMixin from 'react-components/layered-component-mixin';
import { translate } from '../lib/i18n';
import Overlay from './overlay';
import Styles from './styles';
import sections from './sections';
import { TranslatedMessage } from './i18n';

export default React.createClass({
  displayName: 'Ship',

  mixins: [
    LayeredComponentMixin
  ],

  getInitialState() {
    return this.props.engine.getState();
  },

  componentWillMount() {
    this.props.engine.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    this.props.engine.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState(this.props.engine.getState());
  },

  getScope() {
    return `ship-${this.state.ship.id}`;
  },

  getResetStyles() {
    return this.state.shipSettings && this.state.shipSettings.reset_styles;
  },

  renderOverlay() {
    if (!this.state.dialogIsVisible) { return null; }

    const d = { organization: this.state.organization.name };
    const titles = {
      logIn: translate('log-in header', d),
      signUp: translate('sign-up header', d),
      resetPassword: translate('reset password header'),
      showProfile: translate('view profile header'),
      editProfile: translate('edit profile header'),
      thanks: translate('thanks header')
    };

    const Section = sections[this.state.activeSection];
    const t = titles[this.state.activeSection];
    return (
      <Overlay className={this.getScope()} onClose={this.props.actions.hideDialog} title={t} visible={true}>
        <Section {...this.state} {...this.props.actions} />
      </Overlay>
    );
  },

  renderLayer() {
    return (
      <ReactTransitionGroup>{this.renderOverlay()}</ReactTransitionGroup>
    );
  },

  renderUserStyles() {
    return !this.state.shipSettings.custom_styles ? null : <style dangerouslySetInnerHTML={{__html: this.state.shipSettings.custom_styles}}></style>;
  },

  render() {
    const u = this.state.user;

    let buttons = [];
    if (u) {
      if (this.state.shipSettings.show_profile) {
        if (this.state.hasForm && !this.state.formIsSubmitted) {
          let b = <TranslatedMessage tag='a'
            href='#'
            key='complete-profile'
            className='hull-login__button hull-login__button--edit-profile'
            onClick={this.props.actions.activateEditProfileSection}
            message='nav complete profile link' />;
          buttons.push(b);
        } else {
          let b = <a href='#'
            key='show-profile'
            className='hull-login__button hull-login__button--show-profile'
            onClick={this.props.actions.activateShowProfileSection}>{u.name || u.username || u.email}</a>;
          buttons.push(b);
        }
      }

      if (this.state.shipSettings.custom_buttons.length) {
        for (let i = 0; i < this.state.shipSettings.custom_buttons.length; i++) {
          let { url, popup, text } = this.state.shipSettings.custom_buttons[i];
          let b = <a href={url}
            key={`custom-action-${i}`}
            target={popup ? '_blank' : ''}
            className='hull-login__button hull-login__button'>{text}</a>;
          buttons.push(b);
        }
      }

      let b = <TranslatedMessage tag='a'
        href='#'
        className='hull-login__button hull-login__button--log-out'
        onClick={this.props.actions.logOut}
        message='nav logout link' />;
      buttons.push(b);
    } else {
      if (this.state.shipSettings.show_login) {
        let b = <TranslatedMessage tag='a'
          href='#'
          key='log-in'
          className='hull-login__button hull-login__button--log-in'
          onClick={this.props.actions.activateLogInSection}
          message='nav login link' />;
        buttons.push(b);
      }

      if (this.state.shipSettings.show_signup) {
        let b = <TranslatedMessage tag='a'
          href='#'
          key='sign-up'
          className='hull-login__button hull-login__button--sign-up'
          onClick={this.props.actions.activateSignUpSection}
          message='nav sign-up link' />;
        buttons.push(b);
      }
    }

    let s = this.getScope();
    let r = this.getResetStyles();
    return (
      <div className='hull-login'>
        <Styles scope={s} reset={r} />
        {this.renderUserStyles()}
        {buttons}
      </div>
    );
  }
});
