'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Login, Password } from '../../lib/types';
import { getStyles } from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';
import OrganizationImage from './organization-image';
import renderSectionContent from './render-section-content';
import { TranslatedMessage } from '../i18n';

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
        help: translate('log-in email help text'),
        hasError
      },
      password: {
        placeholder: translate('Your password'),
        type: 'password',
        help: translate('log-in password help text'),
        hasError
      }
    };
  },

  handleSubmit(value) {
    this.getAsyncAction('logIn')(value);
  },

  render() {
    let m;
    let d;
    if (this.state.logInState === 'pending') {
      m = translate('Logging in');
      d = true;
    } else {
      // m = translate('Log in');
      m = <span>hi </span>;
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

    let signupLink;
    if (this.props.shipSettings.show_signup) {
      signupLink = <p style={styles.sectionText}>
        <TranslatedMessage tag='a'
          href='#'
          onClick={this.props.activateSignUpSection}
          message="Don't have an account? Sign up!" />
      </p>;
    }

    return (
      <div>
        <div style={styles.sectionHeader}>
          <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
          <TranslatedMessage tag='h1'
            style={styles.sectionTitle}
            message='Log in to {organization}'
            variables={{ organization: this.props.organization.name }} />
          {signupLink}
        </div>

        {content}

        <div style={styles.sectionFooter}>
          <p style={styles.sectionText}>
            <TranslatedMessage tag='a'
              href='javascript: void 0;'
              onClick={this.props.activateResetPasswordSection}
              message='Forgot password?' />
          </p>
        </div>
      </div>
    );
  }
});

