'use strict';

import React from 'react';
import { getStyles } from './styles';
import OrganizationImage from './organization-image';
import { TranslatedMessage } from '../i18n';

export default React.createClass({
  displayName: 'ThanksSection',

  render() {
    const styles = getStyles();

    return (
      <div>
        <div style={styles.sectionHeader}>
          <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
          <TranslatedMessage tag='h1'
            style={styles.sectionTitle}
            message='Thanks for signing up!' />
        </div>
        <TranslatedMessage tag='p'
          style={styles.sectionText}
          message="Hi {name}, your registration is now complete and so we'll keep you up to date."
          variables={{ name: this.props.user.name }} />
      </div>
    );
  }
});

