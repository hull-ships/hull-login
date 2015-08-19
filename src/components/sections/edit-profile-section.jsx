'use strict';

import _ from 'underscore';
import React from 'react';
import { translate } from '../../lib/i18n';
import { getStyles } from './styles';
import transform from 'tcomb-json-schema';
import AsyncActionsMixin from '../../mixins/async-actions';
import Form from '../form';
import UserImage from './user-image';
import { TranslatedMessage } from '../i18n';

function buildSchema() {
  return {
    '$schema': 'http://json-schema.org/draft-04/schema#',
    'type': 'object',
    'properties': {
      'name': {
        'type': 'string',
        'title': translate('edit profile name field')
      },
      'password': {
        'type': 'string',
        'title': translate('edit profile password field'),
        'format': 'password',
        'help': <TranslatedMessage message='edit profile password help text' />
      },
      'email': {
        'type': 'string',
        'title': translate('edit profile email field'),
        'format': 'email',
        'minLength': 1
      }
    },
    'required': [
      'name',
      'email'
    ]
  };
};

export default React.createClass({
  displayName: 'LogInSection',

  mixins: [
    AsyncActionsMixin
  ],

  getAsyncActions() {
    return {
      updateUser: this.props.updateUser
    };
  },

  getSchema() {
    let SCHEMA = buildSchema();
    if (this.props.hasForm) {
      if (this.props.formIsSubmitted) {
        return {
          type: 'object',
          properties: {
            ...SCHEMA.properties,
            ...this.props.form.fields_schema.properties
          },
          required: SCHEMA.required.concat(this.props.form.fields_schema.required)
        };
      }

      return this.props.form.fields_schema;
    }

    return SCHEMA;
  },

  getType() {
    return transform(this.getSchema());
  },

  getFields() {
    let errors = ((this.props.errors || {}).updateUser || {}).errors || {};

    return _.reduce(this.getSchema().properties, function(m, v, k) {
      let f = {
        label: v.title,
        help: v.help,
        hasError: !!errors[k]
      };

      if (v.type === 'string') {
        f.type = v.format === 'uri' ? 'url' : (v.format || 'text');
      }

      m[k] = f;

      return m;
    }, {});
  },

  handleLogOut(e) {
    e.preventDefault();

    this.props.logOut();
    this.props.hideDialog();
  },

  handleSubmit(value) {
    this.getAsyncAction('updateUser')(value);
  },

  render() {
    let title = '';
    let subtitle = '';
    let button = '';
    let disabled = false;

    if (this.props.formIsSubmitted || !this.props.hasForm) {
      title = translate('edit profile header');
      subtitle = <a href='javascript: void 0;' onClick={this.props.activateShowProfileSection}>
        {translate('edit profile cancel button')}
      </a>;
      button = translate('edit profile button text');
    } else {
      title = translate('edit profile header when profile incomplete');
      subtitle = <a href='javascript: void 0;' onClick={this.props.hideDialog}>
        {translate('edit profile cancel button when profile incomplete')}
      </a>;
      button = translate('edit profile button text when profile incomplete');
    }

    if (this.state.updateUserState === 'pending') {
      button = translate('edit profile button text when attempting edit');
      disabled = true;
    }

    let u = this.props.user;
    let value = { ...u, ...(this.props.form.user_data && this.props.form.user_data.data) };
    let styles = getStyles();

    return (
      <div>
        <div style={styles.sectionHeader}>
          <UserImage style={styles.sectionUserImage} src={u.picture} />
          <h1 style={styles.sectionTitle}>{title}</h1>
          <p style={styles.sectionText}>{subtitle}</p>
        </div>

        <Form type={this.getType()}
          fields={this.getFields()}
          value={value}
          submitMessage={button}
          onSubmit={this.handleSubmit}
          disabled={disabled}
          autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically} />
      </div>
    );
  }
});
