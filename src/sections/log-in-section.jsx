import React from 'react';
import { SocialButtons, TranslatedMessage, OrganizationImage, SocialLoginErrors, Divider } from '../components';
import { LogInForm } from '../forms';
import { getStyles } from './styles';

export default class LogInSection extends React.Component {

  renderHeader(styles) {
    let signupLink;
    if (this.props.shipSettings.show_signup) {
      signupLink = <p style={styles.sectionText}>
        <TranslatedMessage tag='a'
          href='#'
          onClick={this.props.activateSignUpSection}
          message="log-in switch to sign-up link" />
      </p>;
    }

    return <div style={styles.sectionHeader}>
      <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
      <TranslatedMessage tag='h1'
        style={styles.sectionTitle}
        message='log-in header'
        variables={{ organization: this.props.organization.name }} />
      {signupLink}
    </div>;
  }

  renderFooter(styles) {
    return <div style={styles.sectionFooter}>
      <p style={styles.sectionText}>
        <TranslatedMessage tag='a'
          href='javascript: void 0;'
          onClick={this.props.activateResetPasswordSection}
          message='log-in forgot password link' />
      </p>
    </div>;
  }

  renderForm() {
    return <div>
      <SocialButtons {...this.props} />
      <Divider>or</Divider>
      <LogInForm {...this.props} />
    </div>;
  }

  render() {
    const styles = getStyles();
    return (
      <div>
        {this.renderHeader(styles)}
        {this.renderForm(styles)}
        {this.renderFooter(styles)}
      </div>
    );
  }
}

