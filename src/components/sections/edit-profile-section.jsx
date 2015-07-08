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
  displayName: 'EditProfileSection',

  mixins: [
    AsyncActionsMixin
  ],

  getAsyncActions() {
    return {
      updatePicture: this.props.updatePicture,
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

    return _.reduce(this.getSchema().properties, function(memo, value, key) {
      let f = {
        label: value.title,
        help: value.help,
        hasError: !!errors[key]
      };

      if (value.type === 'string') {
        f.type = value.format === 'uri' ? 'url' : (value.format || 'text');
      }

      memo[key] = f;

      return memo;
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

  handleDrop(file) {
    this.setState({ pendingPicture: file });
    this.getAsyncAction('updatePicture')(file);
  },

  render() {
    let title = '';
    let subtitle = '';
    let button = '';
    let disabled = false;

    if (this.props.formIsSubmitted || !this.props.hasForm) {
      title = translate('Edit your profile');
      subtitle = <a href='javascript: void 0;' onClick={this.props.activateShowProfileSection}>{translate('Cancel')}</a>;
      button = translate('Save changes');
    } else {
      title = translate('Complete your profile');
      subtitle = <a href='javascript: void 0;' onClick={this.props.hideDialog}>{translate('Skip this step')}</a>;
      button = translate('Complete profile');
    }

    if (this.state.updateUserState === 'pending') {
      button = translate('Saving...');
      disabled = true;
    }

    const u = this.props.user;
    const value = { ...u, ...(this.props.form.user_data && this.props.form.user_data.data) };
    let image = '';
    if (this.state.updatePictureState === 'pending') {
      image = this.state.pendingPicture.preview;
    } else {
      image = u.picture;
    }

    const styles = getStyles();
    const form = <Form type={this.getType()} fields={this.getFields()} value={value} submitMessage={button} onSubmit={this.handleSubmit} disabled={disabled} />;

    return (
      <div>
        <div style={styles.sectionHeader}>
          <UserImage
            style={styles.sectionUserImage}
            src={image}
            editable={true}
            onDrop={this.handleDrop}
            />
          <h1 style={styles.sectionTitle}>{title}</h1>
          <p style={styles.sectionText}>{subtitle}</p>
        </div>
        
        {form}
      </div>
    );
  }
});
