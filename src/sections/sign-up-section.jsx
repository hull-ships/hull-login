import React from 'react';
import _ from 'lodash';
import cssModules from 'react-css-modules';
import styles from './sections.css';
import { translate } from '../lib/i18n';

import { SocialButtons, TranslatedMessage, OrganizationImage, Divider } from '../components';
import { SignUpForm } from '../forms';
import BaseSection from './base-section';

class SignUpSection extends BaseSection {

  renderHeader() {
    return (
      <div styleName="header">
        <OrganizationImage src={this.props.shipSettings.logo_image} />
        <TranslatedMessage tag="h1"
          styleName="title"
          message="sign-up header"
          variables={{ organization: this.props.organization.name }} />
        <p styleName="text">
          <TranslatedMessage tag="a"
            href="#"
            className={this.props.styles.link}
            onClick={this.props.activateLogInSection}
            message="sign-up switch to log-in link" />
        </p>
      </div>
    );
  }

  renderFooter() {
    return (
        <div styleName="footer">
          <span styleName="text">
            <TranslatedMessage tag="p"
              styleName="text"
              message="sign-up fine print"
              variables={{ organization: this.props.organization.name }} />
          </span>
      </div>
    );
  }

  renderContent() {
    const { shipSettings } = this.props;
    const props = _.omit(this.props, 'styles');
    let content;
    if (shipSettings.show_classic_login) {
      content = (
        <div>
          <SocialButtons {...props} />
          <Divider>{translate('divider or', {}, 'or')}</Divider>
          <SignUpForm {...props} />
        </div>
      );
    } else {
      content = <div><SocialButtons {...props} /></div>;
    }

    return content;
  }
}

export default cssModules(SignUpSection, styles);
