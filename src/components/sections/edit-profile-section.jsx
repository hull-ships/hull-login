'use strict';

import _ from 'underscore';
import React from 'react';
import { translate } from '../../lib/i18n';
import { getStyles } from './styles';
import transform from 'tcomb-json-schema';
import AsyncActionsMixin from '../../mixins/async-actions';
import Form from '../form';
import UserImage from './user-image';

const DEFAULT_SCHEMA = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string',
      'title': 'Name'
    },
    'password': {
      'type': 'string',
      'title': 'Password',
      'format': 'password',
      'help': 'Leave blank to keep your old password'
    },
    'email': {
      'type': 'string',
      'title': 'Email',
      'format': 'email',
      'minLength': 1
    }
  },
  'required': [
    'name',
    'email'
  ]
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
    if (this.props.hasForm) {
      if (this.props.formIsSubmitted) {
        return {
          type: 'object',
          properties: {
            ...DEFAULT_SCHEMA.properties,
            ...this.props.form.fields_schema.properties
          },
          required: DEFAULT_SCHEMA.required.concat(this.props.form.fields_schema.required)
        };
      }

      return this.props.form.fields_schema;
    }

    return DEFAULT_SCHEMA;
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
      title = translate('Edit your profile');
      subtitle = <a href='javascript: void 0;' onClick={this.props.activateShowProfileSection}>{translate('Cancel')}</a>;
      button = translate('Edit profile');
    } else {
      title = translate('Complete your profile');
      subtitle = <a href='javascript: void 0;' onClick={this.props.hideDialog}>{translate('Skip this step')}</a>;
      button = translate('Complete profile');
    }

    if (this.state.updateUserState === 'pending') {
      button = translate('Saving...');
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

        <Form type={this.getType()} fields={this.getFields()} value={value} submitMessage={button} onSubmit={this.handleSubmit} disabled={disabled} />
      </div>
    );
  }
});
