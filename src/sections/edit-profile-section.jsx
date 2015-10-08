import React from 'react';
import { TranslatedMessage, UserImage } from '../components';
import { EditProfileForm } from '../forms';
import BaseSection from './base-section';
import assign from 'object-assign';

export default class SignUpSection extends BaseSection {

  renderHeader(styles) {
    let title;
    let subtitle;
    let handleClick;

    if (this.props.formIsSubmitted || !this.props.hasForm) {
      title = 'edit profile header';
      subtitle = 'edit profile cancel button';
      handleClick = this.props.activateShowProfileSection.bind(this);
    } else {
      title = 'edit profile header when profile incomplete';
      subtitle = 'edit profile cancel button when profile incomplete';
      handleClick = this.props.hideDialog.bind(this);
    }

    let { picture } = this.props.user || {};
    const blockStyle = assign({}, styles.sectionText, {display: 'block'});
    return <div style={styles.sectionHeader}>
      <UserImage style={styles.sectionUserImage} src={picture} />
      <TranslatedMessage tag='h1' style={styles.sectionTitle} message={title} />
      <TranslatedMessage href='javascript: void 0;' tag='a' onClick={handleClick} style={blockStyle} message={subtitle} />
    </div>;
  }

  renderContent() {
    return <EditProfileForm {...this.props} />;
  }
}
