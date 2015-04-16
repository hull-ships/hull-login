'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Name, Email, Password } from '../../lib/types';
import SocialButtons from '../social-buttons';
import Form from '../form';
import Divider from '../divider';
import styles from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';

export default React.createClass({
  displayName: 'SignUpSection',

  mixins: [
    AsyncActionsMixin
  ],

  getAsyncActions() {
    return {
      signUp: this.props.signUp
    };
  },

  getType() {
    return t.struct({
      name: Name,
      email: Email,
      password: Password
    });
  },

  getFields() {
    return {
      name: {
        placeholder: translate('Your name'),
        spellCheck: false,
        type: 'text'
      },
      email: {
        placeholder: translate('Your email'),
        spellCheck: false,
        type: 'email'
      },
      password: {
        placeholder: translate('Your password'),
        type: 'password'
      }
    };
  },

  handleSubmit(value) {
    this.getAsyncAction('signUp')(value);
  },

  render() {
    let m, d;
    if (this.state.signUpState === 'pending') {
      m = translate('Signing up');
      d = true;
    } else {
      m = translate('Sign up');
      d = false;
    }

    return (
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h1 style={styles.sectionTitle}>{translate('Join {organization}!', { organization: this.props.organization.name })}</h1>
          <p style={styles.sectionText}><a href='javascript: void 0;' onClick={this.props.activateLogInSection}>{translate('Already have an account? Log in.')}</a></p>
        </div>

        <SocialButtons {...this.props} />

        <Divider>or</Divider>

        <Form kind='compact' type={this.getType()} fields={this.getFields()} submitMessage={m} onSubmit={this.handleSubmit} disabled={d} />

        <div style={styles.sectionFooter}>
          <p style={styles.sectionText}>{translate("By signing up, you agree to {organization}'s Terms of Service.", { organization: this.props.organization.name })}</p>
        </div>
      </div>
    );
  }
});

