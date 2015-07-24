'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Name, Email, Password } from '../../lib/types';
import { getStyles } from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';
import OrganizationImage from './organization-image';
import renderSectionContent from './render-section-content';

export default React.createClass({
  displayName: 'SignUpSection',

  mixins: [
    AsyncActionsMixin
  ],

  getAsyncActions() {
    return {
      signUp: this.props.signUp
    };
  },

  getType() {
    return t.struct({
      name: Name,
      email: Email,
      password: Password
    });
  },

  getFields() {
    let errors = (this.props.errors.signUp || {}).errors || {};

    return {
      name: {
        placeholder: translate('Your name'),
        type: 'text',
        help: translate('sign-up name help text'),
        hasError: !!errors.name
      },
      email: {
        placeholder: translate('Your email'),
        type: 'email',
        help: translate('sign-up email help text'),
        hasError: !!errors.email
      },
      password: {
        placeholder: translate('Your password'),
        type: 'password',
        help: translate('sign-up password help text'),
        hasError: !!errors.password
      }
    };
  },

  handleSubmit(value) {
    this.getAsyncAction('signUp')(value);
  },

  render() {
    let m;
    let d;
    if (this.state.signUpState === 'pending') {
      m = translate('Signing up');
      d = true;
    } else {
      m = translate('Sign up');
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
    let loginLink;
    if (this.props.shipSettings.show_login) {
      loginLink = <p style={styles.sectionText}><a href='javascript: void 0;' onClick={this.props.activateLogInSection}>{translate('Already have an account? Log in.')}</a></p>;
    }

    return (
      <div>
        <div style={styles.sectionHeader}>
          <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
          <h1 style={styles.sectionTitle}>{translate('Sign up for {organization}', { organization: this.props.organization.name })}</h1>
          {loginLink}
        </div>

        {content}

        <div style={styles.sectionFooter}>
          <p style={styles.sectionText}>{translate("By signing up, you agree to {organization}'s Terms of Service.", { organization: this.props.organization.name })}</p>
        </div>
      </div>
    );
  }
});

