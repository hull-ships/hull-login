'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Name, Email, Password } from '../../lib/types';
import { getStyles } from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';
import renderSectionContent from './render-section-content';
import SocialLoginErrors from '../social-login-errors';
import { TranslatedMessage } from '../i18n';
import OrganizationImage from './organization-image';

export default React.createClass({
  displayName: 'SignUpSection',

  mixins: [
    AsyncActionsMixin
  ],

  getInitialState() {
    return { displayErrors: false };
  },

  getAsyncActions() {
    return {
      signUp: this.props.signUp
    };
  },

  getType() {
    return t.struct({
      email: Email,
      password: Password
    });
  },

  getFields() {
    let { displayErrors } = this.state;
    let errors = ((this.props.errors.signUp || {}).errors || {});

    return {
      email: {
        placeholder: translate('sign-up email placeholder'),
        type: 'email',
        help: <TranslatedMessage message='sign-up email help text' />,
        hasError: displayErrors && !!errors.email,
        error: displayErrors && errors.email && translate(['sign-up email', errors.email, 'error'].join(' ')),
        autoFocus: true
      },
      password: {
        placeholder: translate('sign-up password placeholder'),
        type: 'password',
        help: <TranslatedMessage message='sign-up password help text' />,
        hasError: displayErrors && !!errors.password,
        error: displayErrors && errors.password && translate('sign-up password too short error')
      }
    };
  },

  handleSubmit(value) {
    this.setState({ displayErrors: true });
    this.getAsyncAction('signUp')(value);
  },

  handleChange(changes) {
    this.setState({ displayErrors: false });
    let { email } = changes.value;
    if (email) {
      this.props.updateCurrentEmail(email);
    }
  },

  render() {
    let m;
    let d;
    if (this.state.signUpState === 'pending') {
      m = translate('sign-up button text when attempting sign-up');
      d = true;
    } else {
      m = translate('sign-up button text');
      d = false;
    }

    let content = renderSectionContent(this.props, {
      kind: (this.props.shipSettings.show_classic_login_as_button) ? 'expand' : 'compact',
      type: this.getType(),
      fields: this.getFields(),
      submitMessage: m,
      onSubmit: this.handleSubmit,
      onChange: this.handleChange,
      disabled: d,
      value: { email: this.props.currentEmail }
    });

    const styles = getStyles();
    let loginLink;
    if (this.props.shipSettings.show_login) {
      loginLink = <p style={styles.sectionText}>
        <TranslatedMessage tag='a'
          href='#'
          onClick={this.props.activateLogInSection}
          message='sign-up switch to log-in link' />
      </p>;
    }

    return (
      <div>
        <div style={styles.sectionHeader}>
          <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
          <TranslatedMessage tag='h1'
            style={styles.sectionTitle}
            message="sign-up header"
            variables={{ organization: this.props.organization.name }} />
          {loginLink}
        </div>

        <SocialLoginErrors {...this.props} />
        
        {content}

        <div style={styles.sectionFooter}>
          <TranslatedMessage tag='p'
            style={styles.sectionText}
            message="sign-up fine print"
            variables={{ organization: this.props.organization.name }} />
        </div>
      </div>
    );
  }
});

