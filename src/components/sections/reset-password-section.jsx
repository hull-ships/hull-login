'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Email } from '../../lib/types';
import Form from '../form';
import { getStyles } from './styles';

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
    this.props.resetPassword(value.email);
  },

  render() {
    const styles = getStyles();

    return (
      <div>
        <div style={styles.sectionHeader}>
          <h1 style={styles.sectionTitle}>{translate('Reset your password')}</h1>
          <p style={styles.sectionText}><a href='javascript: void 0;' onClick={this.props.activateLogInSection}>{translate('Know your password? Log in!')}</a></p>
        </div>

        <Form kind='compact' type={this.getType()} fields={this.getFields()} submitMessage={translate('Send reset instructions')} onSubmit={this.handleSubmit} />
      </div>
    );
  }
});

