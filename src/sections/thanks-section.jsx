import React from 'react';
import cssModules from 'react-css-modules';
import styles from './sections.css';

import { OrganizationImage, TranslatedMessage } from '../components';
import BaseSection from './base-section';

export default class ThanksSection extends BaseSection {

  renderHeader() {
    return (
      <div styleName="header">
        <OrganizationImage styleName="organization-image" src={this.props.shipSettings.logo_image} />
        <TranslatedMessage tag="h1"
          styleName="title"
          message="thanks header" />
      </div>
    );
  }

  renderContent() {
    return (
      <TranslatedMessage tag="p"
        styleName="text"
        message="thanks message"
        variables={{ name: this.props.user.name }} />
    );
  }
}

export default cssModules(ThanksSection, styles);
