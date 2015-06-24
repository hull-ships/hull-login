'use strict';

import React from 'react';
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup';
import LayeredComponentMixin from 'react-components/layered-component-mixin';
import { translate } from '../lib/i18n';
import Overlay from './overlay';
import Styles from './styles';
import sections from './sections';

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
  getResetStyles(){
    return this.state.shipSettings && this.state.shipSettings.appearance && this.state.shipSettings.reset_styles
  },

  renderOverlay() {
    if (!this.state.dialogIsVisible) { return; }

    const d = { organization: this.state.organization.name };
    const titles = {
      logIn: translate('Log in to {organization}', d),
      signUp: translate('Sign up for {organization}', d),
      resetPassword: translate('Reset your password'),
      showProfile: translate('View your profile'),
      editProfile: translate('Edit your profile'),
      thanks: translate('Thanks for signing up!')
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

  render() {
    const u = this.state.user;

    let buttons = [];
    if (u) {
      
      if(this.state.shipSettings.show_profile){

        if (!this.state.formIsSubmitted) {
          let b = <a href='javascript: void 0;' className='hull-login__button hull-login__button--edit-profile' onClick={this.props.actions.activateEditProfileSection}>{translate('Complete your profile')}</a>
          buttons.push(b);

        } else {

          let b = <a href='javascript: void 0;' className='hull-login__button hull-login__button--show-profile' onClick={this.props.actions.activateShowProfileSection}>{u.name || u.username || u.email}</a>
          buttons.push(b);

        }

      } 

      if(this.state.shipSettings.custom_buttons.length){
        for (var i = 0; i < this.state.shipSettings.custom_buttons.length; i++) {
          let button_def = this.state.shipSettings.custom_buttons[i]
          let b = <a href={button_def.url} target={button_def.popup ? "_blank" : ""} className="hull-login__button hull-login__button">{button_def.text}</a>
          buttons.push(b);
        };
      }

      let b = <a href='javascript: void 0;' className='hull-login__button hull-login__button--log-out' onClick={this.props.actions.logOut}>{translate('Log out')}</a>
      buttons.push(b);


    } else {
      console.log(this.state.shipSettings.show_login, this.state.shipSettings.show_signup)
      if(this.state.shipSettings.show_login){
        let b= <a href='javascript: void 0;' className='hull-login__button hull-login__button--log-in' onClick={this.props.actions.activateLogInSection}>{translate('Log in')}</a>
        console.log(b)
        buttons.push(b);
      }

      if(this.state.shipSettings.show_signup){
        let b = <a href='javascript: void 0;' className='hull-login__button hull-login__button--sign-up' onClick={this.props.actions.activateSignUpSection}>{translate('Sign up')}</a>
        console.log(b,'a')
        buttons.push(b);
      }
    }

    let s = this.getScope();
    let r = this.getResetStyles();
    return (
      <div className='hull-login'>
        <Styles scope={s} reset={r} />
        {buttons}
      </div>
    );
  }
});

