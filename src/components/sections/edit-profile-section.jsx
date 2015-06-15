'use strict';

import React from 'react';
import { translate } from '../../lib/i18n';
import { getStyles } from './styles';
import { toType } from 'tcomb-json-schema';
import Form from '../form';
import AsyncActionsMixin from '../../mixins/async-actions';
import _ from 'underscore';
import UserImage from './user-image';

export default React.createClass({
  displayName: 'EditProfileSection',

  mixins: [
    AsyncActionsMixin
  ],

  getAsyncActions() {
    return {
      updateProfile: this.props.updateProfile,
      updatePicture: this.props.updatePicture
    };
  },

  getType() {
    return toType(this.props.form.fields_schema);
  },

  getFields() {
    return _.reduce(this.props.form.fields_schema.properties, function(memo, value, key) {
      let f = { label: value.title };

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
    this.getAsyncAction('updateProfile')(value);
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

    if (this.props.formIsSubmitted) {
      title = translate('Edit your profile');
      subtitle = <a href='javascript: void 0;' onClick={this.props.activateShowProfileSection}>{translate('Cancel')}</a>
      button = translate('Save changes');
    } else {
      title = translate('Complete your profile');
      subtitle = <a href='javascript: void 0;' onClick={this.props.hideDialog}>{translate('Skip this step')}</a>
      button = translate('Complete profile');
    }

    if (this.state.updateProfileState === 'pending') {
      button = translate('Saving...');
      disabled = true;
    }

    const u = this.props.user;
    const value = this.props.form.user_data && this.props.form.user_data.data;

    let image = '';
    if (this.state.updatePictureState === 'pending') {
      image = this.state.pendingPicture.preview;
    } else {
      image = u.picture;
    }

    const styles = getStyles();

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

        <Form
          type={this.getType()}
          fields={this.getFields()}
          value={value}
          submitMessage={button}
          onSubmit={this.handleSubmit}
          disabled={disabled} />
      </div>
    );
  }
});

