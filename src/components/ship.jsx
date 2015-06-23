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

    let l1, l2;
    if (u) {
      if (this.state.formIsExtant && !this.state.formIsSubmitted) {
        l1 = <a href='javascript: void 0;' onClick={this.props.actions.activateEditProfileSection}>{translate('Complete your profile')}</a>
      } else {
        l1 = <a href='javascript: void 0;' onClick={this.props.actions.activateShowProfileSection}>{u.name || u.username || u.email}</a>
      }

      l2 = <a href='javascript: void 0;' onClick={this.props.actions.logOut}>{translate('Log out')}</a>
    } else {
      l1 = <a href='javascript: void 0;' onClick={this.props.actions.activateLogInSection}>{translate('Log in')}</a>
      l2 = <a href='javascript: void 0;' onClick={this.props.actions.activateSignUpSection}>{translate('Sign up')}</a>
    }

    let s = this.getScope();
    return (
      <div>
        <Styles scope={s} />
        {l1} | {l2}
      </div>
    );
  }
});

