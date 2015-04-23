'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Login, Password } from '../../lib/types';
import SocialButtons from '../social-buttons';
import Form from '../form';
import Divider from '../divider';
import { getStyles } from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';

export default React.createClass({
  displayName: 'LogInSection',

  mixins: [
    AsyncActionsMixin
  ],

  getAsyncActions() {
    return {
      logIn: this.props.logIn
    };
  },

  getType() {
    return t.struct({
      login: Login,
      password: Password
    });
  },

  getFields() {
    return {
      login: {
        placeholder: translate('Your email or username'),
        spellCheck: false,
        type: 'text'
      },
      password: {
        placeholder: translate('Your password'),
        type: 'password'
      }
    };
  },

  handleSubmit(value) {
    this.getAsyncAction('logIn')(value);
  },

  renderSocialButtons() {
    if (this.props.providers.length === 0) { return; }

    return [
      <SocialButtons {...this.props} />,
      <Divider>or</Divider>
    ];
  },

  render() {
    let m, d;
    if (this.state.logInState === 'pending') {
      m = translate('Logging in');
      d = true;
    } else {
      m = translate('Log in');
      d = false;
    }

    const styles = getStyles();

    return (
      <div>
        <div style={styles.sectionHeader}>
          <h1 style={styles.sectionTitle}>{translate('Welcome back!')}</h1>
          <p style={styles.sectionText}><a href='javascript: void 0;' onClick={this.props.activateSignUpSection}>{translate('Don’t have an account? Sign up!')}</a></p>
        </div>

        {this.renderSocialButtons()}

        <Form kind='compact' type={this.getType()} fields={this.getFields()} submitMessage={m} onSubmit={this.handleSubmit} disabled={d} />

        <div style={styles.sectionFooter}>
          <p style={styles.sectionText}><a href='javascript: void 0;' onClick={this.props.activateResetPasswordSection}>{translate('Forgot Password?')}</a></p>
        </div>
      </div>
    );
  }
});

