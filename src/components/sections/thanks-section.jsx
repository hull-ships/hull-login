'use strict';

import React from 'react';
import { translate } from '../../lib/i18n';
import { getStyles } from './styles';
import OrganizationImage from './organization-image';

export default React.createClass({
  displayName: 'ThanksSection',

  render() {
    const styles = getStyles();

    const w = translate("Hi {name}, your registration is now complete and so we'll keep you up to date.", {
      name: this.props.user.name
    });

    return (
      <div>
        <div style={styles.sectionHeader}>
          <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
          <h1 style={styles.sectionTitle}>{translate('Thanks!')}</h1>
        </div>
        <p style={styles.sectionText}>{w}</p>
      </div>
    );
  }
});

