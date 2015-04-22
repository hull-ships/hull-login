'use strict';

import React from 'react';
import { translate } from '../../lib/i18n';
import styles from './styles';
import { toType } from 'tcomb-json-schema';
import Form from '../form';
import AsyncActionsMixin from '../../mixins/async-actions';
import _ from 'underscore';

export default React.createClass({
  displayName: 'LogInSection',

  mixins: [
    AsyncActionsMixin
  ],

  getAsyncActions() {
    return {
      updateProfile: this.props.updateProfile
    };
  },

  getType() {
    return toType(this.props.form.fields_schema);
  },

  getFields() {
    return _.reduce(this.props.form.fields_schema.properties, function(m, v, k) {
      let f = { label: v.title };

      if (v.type === 'string') {
        f.type = v.format === 'uri' ? 'url' : (v.format || 'text');
      }

      m[k] = f;

      return m;
    }, {});
  },

  handleLogOut: function(e) {
    e.preventDefault();

    this.props.logOut();
    this.props.hideDialog();
  },

  handleSubmit(value) {
    this.getAsyncAction('updateProfile')(value);
  },

  render() {
    let title = '';
    let subtitle = '';
    let button = '';
    let disabled = false;

    if (this.props.formIsSubmitted) {
      title = translate('Edit your profile');
      subtitle = <a href='javascript: void 0;' onClick={this.props.activateShowProfileSection}>{translate('Cancel')}</a>
      button = translate('Edit profile');
    } else {
      title = translate('Complate your profile');
      subtitle = <a href='javascript: void 0;' onClick={this.props.activateShowProfileSection}>{translate('Skip this step')}</a>
      button = translate('Complete profile');
    }

    if (this.state.updateProfileState === 'pending') {
      button = translate('Saving...');
      disabled = true;
    }

    const u = this.props.user;
    const value = this.props.form.user_data && this.props.form.user_data.data;

    return (
      <div>
        <div style={styles.sectionHeader}>
          <h1 style={styles.sectionTitle}>{title}</h1>
          <p style={styles.sectionText}>{subtitle}</p>
        </div>

        <Form type={this.getType()} fields={this.getFields()} value={value} submitMessage={button} onSubmit={this.handleSubmit} disabled={disabled} />
      </div>
    );
  }
});

