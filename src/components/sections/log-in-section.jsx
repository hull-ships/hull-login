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
import OrganizationImage from './organization-image';
import renderSectionContent from './render-section-content';

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
    const e = this.props.errors.logIn;
    const hasError = e && e.provider === 'classic';

    return {
      login: {
        placeholder: translate('Your email or username'),
        type: 'text',
        hasError
      },
      password: {
        placeholder: translate('Your password'),
        type: 'password',
        hasError
      }
    };
  },

  handleSubmit(value) {
    this.getAsyncAction('logIn')(value);
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

    let content = renderSectionContent(this.props, {
      kind: 'compact',
      type: this.getType(),
      fields: this.getFields(),
      submitMessage: m,
      onSubmit: this.handleSubmit,
      disabled: d
    });

    const styles = getStyles();

    return (
      <div>
        <div style={styles.sectionHeader}>
          <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
          <h1 style={styles.sectionTitle}>{translate('Welcome back!')}</h1>
          <p style={styles.sectionText}><a href='javascript: void 0;' onClick={this.props.activateSignUpSection}>{translate("Don't have an account? Sign up!")}</a></p>
        </div>

        {content}

        <div style={styles.sectionFooter}>
          <p style={styles.sectionText}><a href='javascript: void 0;' onClick={this.props.activateResetPasswordSection}>{translate('Forgot Password?')}</a></p>
        </div>
      </div>
    );
  }
});

