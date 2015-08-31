import React from 'react';
import { TranslatedMessage, OrganizationImage } from '../components';
import { ResetPasswordForm } from '../forms';
import BaseSection from './base-section';

export default class ResetPasswordSection extends BaseSection {

  renderHeader(styles) {
    return <div style={styles.sectionHeader}>
      <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
      <TranslatedMessage tag='h1'
        style={styles.sectionTitle}
        message='reset password header' />
      <p style={styles.sectionText}>
        <TranslatedMessage tag='a'
          href='#'
          onClick={this.props.activateLogInSection}
          message='reset password switch to log-in link' />
      </p>
    </div>;
  }

  renderContent() {
    return <ResetPasswordForm {...this.props} />;
  }
}

