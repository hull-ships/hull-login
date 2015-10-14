import React from 'react';
import cssModules from 'react-css-modules';
import styles from './sections.css';

import { SocialButtons, TranslatedMessage, OrganizationImage, Divider } from '../components';
import { LogInForm } from '../forms';
import BaseSection from './base-section';

class LogInSection extends BaseSection {

  renderHeader() {
    let signupLink;
    if (this.props.shipSettings.show_signup) {
      signupLink = (
        <p styleName="text">
          <TranslatedMessage tag="a"
            href="#"
            className={this.props.styles.link}
            onClick={this.props.activateSignUpSection}
            message="log-in switch to sign-up link" />
        </p>
      );
    }

    return (
      <div styleName="header">
        <OrganizationImage src={this.props.shipSettings.logo_image} />
        <TranslatedMessage tag="h1"
          styleName="title"
          message="log-in header"
          variables={{ organization: this.props.organization.name }} />
        {signupLink}
      </div>
    );
  }

  renderFooter() {
    const { shipSettings } = this.props;
    if (shipSettings.show_classic_login) {
      return (
        <div styleName="footer">
          <p styleName="text">
            <TranslatedMessage tag="a"
              className={this.props.styles.link}
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


export default cssModules(LogInSection, styles);
