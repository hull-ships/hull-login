'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Email } from '../../lib/types';
import Form from '../form';
import styles from './styles';

export default React.createClass({
  getType() {
    return t.struct({
      email: Email,
    });
  },

  getFields() {
    return {
      email: {
        placeholder: translate('Your email'),
        type: 'email'
      }
    };
  },

  handleSubmit(value) {
    this.props.resetPassword(value && value.email);
  },

  render() {
    return (
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h1 style={styles.sectionTitle}>{translate('Reset your password')}</h1>
          <p style={styles.sectionText}><a href='javascript: void 0;' onClick={this.props.activateLogInSection}>{translate('Know your password? Log in!')}</a></p>
        </div>

        <Form type={this.getType()} fields={this.getFields()} submitMessage={translate('Send reset instructions')} onSubmit={this.handleSubmit} />
      </div>
    );
  }
});

