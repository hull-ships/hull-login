import React from 'react';
import cssModules from 'react-css-modules';
import styles from './sections.css';

import { TranslatedMessage, OrganizationImage } from '../components';
import { ResetPasswordForm } from '../forms';
import BaseSection from './base-section';

class ResetPasswordSection extends BaseSection {

  renderHeader() {
    return (
      <div styleName="header">
        <OrganizationImage src={this.props.shipSettings.logo_image} />
        <TranslatedMessage tag="h1"
          styleName="title"
          message="reset password header" />
        <p styleName="text">
          <TranslatedMessage tag="a"
            href="#"
            className={this.props.styles.link}
            onClick={this.props.activateLogInSection}
            message="reset password switch to log-in link" />
        </p>
      </div>
    );
  }

  renderContent() {
    return <ResetPasswordForm {...this.props} />;
  }
}

export default cssModules(ResetPasswordSection, styles);
