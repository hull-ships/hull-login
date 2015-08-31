import React from 'react';
import { SocialButtons, TranslatedMessage, OrganizationImage, Divider } from '../components';
import { SignUpForm } from '../forms';
import { getStyles } from './styles';

export default class SignUpSection extends React.Component {

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

  renderForm() {
    return <div>
      <SocialButtons {...this.props} />
      <Divider>or</Divider>
      <SignUpForm {...this.props} />
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
