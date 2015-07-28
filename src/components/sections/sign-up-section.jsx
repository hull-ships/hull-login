'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Name, Email, Password } from '../../lib/types';
import { getStyles } from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';
import OrganizationImage from './organization-image';
import renderSectionContent from './render-section-content';
import { TranslatedMessage } from '../i18n';

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
        placeholder: translate('sign-up name placeholder'),
        type: 'text',
        help: <TranslatedMessage message='sign-up name help text' />,
        hasError: !!errors.name
      },
      email: {
        placeholder: translate('sign-up email placeholder'),
        type: 'email',
        help: <TranslatedMessage message='sign-up email help text' />,
        hasError: !!errors.email
      },
      password: {
        placeholder: translate('sign-up password placeholder'),
        type: 'password',
        help: <TranslatedMessage message='sign-up password help text' />,
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
      m = translate('sign-up button text when attempting sign-up');
      d = true;
    } else {
      m = translate('sign-up button text');
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

