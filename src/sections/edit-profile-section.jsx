import React from 'react';
import cssModules from 'react-css-modules';
import styles from './sections.css';

import { TranslatedMessage, UserImage } from '../components';
import { EditProfileForm } from '../forms';
import BaseSection from './base-section';
import assign from 'object-assign';

class SignUpSection extends BaseSection {

  renderHeader() {
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

    const { picture } = this.props.user || {};
    const blockStyle = assign({}, styles.sectionText, {display: 'block'});
    return (
      <div styleName="header">
        <UserImage styleName="user-image" src={picture} />
        <TranslatedMessage tag="h1" styleName="title" message={title} />
        <p styleName="text">
          <TranslatedMessage href="#" tag="a" className={this.props.styles.link} onClick={handleClick} style={blockStyle} message={subtitle} />
        </p>
      </div>
    );
  }

  renderContent() {
    return <EditProfileForm {...this.props} />;
  }
}


export default cssModules(SignUpSection, styles);
