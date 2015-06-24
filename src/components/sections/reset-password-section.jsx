'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Email } from '../../lib/types';
import Form from '../form';
import { getStyles } from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';
import OrganizationImage from './organization-image';

export default React.createClass({
  displayName: 'ResetPasswordSection',

  mixins: [
    AsyncActionsMixin
  ],

  getAsyncActions() {
    return {
      resetPassword: this.props.resetPassword
    };
  },

  getType() {
    return t.struct({
      email: Email
    });
  },

  getFields() {
    let hasError = this.props.errors.resetPassword != null;

    return {
      email: {
        placeholder: translate('Your email'),
        type: 'email',
        hasError
      }
    };
  },

  handleSubmit(value) {
    this.getAsyncAction('resetPassword')(value.email);
  },

  render() {
    let m;
    let d;
    if (this.state.resetPasswordState === 'done') {
      m = translate('Sent');
      d = true;
    } else if (this.state.resetPasswordState === 'pending') {
      m = translate('Sending...');
      d = true;
    } else {
      m = translate('Send reset instructions');
      d = false;
    }

    const styles = getStyles();

    return (
      <div>
        <div style={styles.sectionHeader}>
          <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
          <h1 style={styles.sectionTitle}>{translate('Reset your password')}</h1>
          <p style={styles.sectionText}><a href='javascript: void 0;' onClick={this.props.activateLogInSection}>{translate('Know your password? Log in!')}</a></p>
        </div>

        <Form kind='compact' type={this.getType()} fields={this.getFields()} submitMessage={m} onSubmit={this.handleSubmit} disabled={d} />
      </div>
    );
  }
});

