import React from 'react';
import { SocialButtons, TranslatedMessage, OrganizationImage, Divider } from '../components';
import { LogInForm } from '../forms';
import BaseSection from './base-section';

export default class LogInSection extends BaseSection {

  renderHeader(styles) {
    let signupLink;
    if (this.props.shipSettings.show_signup) {
      signupLink = (
        <p style={styles.sectionText}>
          <TranslatedMessage tag="a"
            href="#"
            onClick={this.props.activateSignUpSection}
            message="log-in switch to sign-up link" />
        </p>
      );
    }

    return (
      <div style={styles.sectionHeader}>
        <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
        <TranslatedMessage tag="h1"
          style={styles.sectionTitle}
          message="log-in header"
          variables={{ organization: this.props.organization.name }} />
        {signupLink}
      </div>
    );
  }

  renderFooter(styles) {
    const { shipSettings } = this.props;
    if (shipSettings.show_classic_login) {
      return (
        <div style={styles.sectionFooter}>
          <p style={styles.sectionText}>
            <TranslatedMessage tag="a"
              href="javascript: void 0;"
              onClick={this.props.activateResetPasswordSection}
              message="log-in forgot password link" />
          </p>
        </div>
      );
    }
  }

  renderContent() {
    const { shipSettings } = this.props;
    let content;
    if (shipSettings.show_classic_login) {
      content = (
        <div>
          <SocialButtons {...this.props} />
          <Divider>or</Divider>
          <LogInForm {...this.props} />
        </div>
      );
    } else {
      content = <div><SocialButtons {...this.props} /></div>;
    }

    return content;
  }
}

