import React from 'react';
import { OrganizationImage, TranslatedMessage } from '../components';
import BaseSection from './base-section';

export default class ThanksSection extends BaseSection {

  renderHeader(styles) {
    return <div style={styles.sectionHeader}>
      <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
      <TranslatedMessage tag='h1'
        style={styles.sectionTitle}
        message='thanks header' />
    </div>;
  }

  renderContent(styles) {
    return <TranslatedMessage tag='p'
          style={styles.sectionText}
          message='thanks message'
          variables={{ name: this.props.user.name }} />;
  }
}

