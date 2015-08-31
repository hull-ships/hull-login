import React from 'react';
import { bind } from 'underscore';
import { TranslatedMessage, UserImage } from '../components';
import { EditProfileForm } from '../forms';
import BaseSection from './base-section';

export default class SignUpSection extends BaseSection {

  handleSubtitleClick(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (this.props.formIsSubmitted || !this.props.hasForm) {
      this.props.activateShowProfileSection();
    } else {
      this.props.hideDialog();
    }
  }

  renderHeader(styles) {
    let title;
    let subtitle;
    if (this.props.formIsSubmitted || !this.props.hasForm) {
      title = 'edit profile header';
      subtitle = 'edit profile cancel button';
    } else {
      title = 'edit profile header when profile incomplete';
      subtitle = 'edit profile cancel button when profile incomplete';
    }

    let { picture } = this.props.user || {};
    return <div style={styles.sectionHeader}>
      <UserImage style={styles.sectionUserImage} src={picture} />
      <TranslatedMessage tag='h1' style={styles.sectionTitle} message={title} />
      <a href='javascript: void 0;' onClick={bind(this.handleSubtitleClick, this)}>
        <TranslatedMessage tag='p' style={styles.sectionText} message={subtitle} />
      </a>
    </div>;
  }

  renderContent() {
    return <EditProfileForm {...this.props} />;
  }
}
