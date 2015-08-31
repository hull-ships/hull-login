import React from 'react';
import { SocialButtons, TranslatedMessage, OrganizationImage, Divider } from '../components';
import { SignUpForm } from '../forms';
import BaseSection from './base-section';

export default class SignUpSection extends BaseSection {

  renderHeader(styles) {
    let loginLink;
    if (this.props.shipSettings.show_login) {
      loginLink = <p style={styles.sectionText}>
        <TranslatedMessage tag='a'
          href='#'
          onClick={this.props.activateLogInSection}
          message='sign-up switch to log-in link' />
      </p>;
    }
    return <div style={styles.sectionHeader}>
      <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
      <TranslatedMessage tag='h1'
        style={styles.sectionTitle}
        message="sign-up header"
        variables={{ organization: this.props.organization.name }} />
      {loginLink}
    </div>;
  }

  renderFooter(styles) {
    return <div style={styles.sectionFooter}>
      <TranslatedMessage tag='p'
        style={styles.sectionText}
        message="sign-up fine print"
        variables={{ organization: this.props.organization.name }} />
    </div>;
  }

  renderContent() {
    return <div>
      <SocialButtons {...this.props} />
      <Divider>or</Divider>
      <SignUpForm {...this.props} />
    </div>;
  }
}
