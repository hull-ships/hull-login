import React from 'react';
import { getStyles } from './styles';
import { OrganizationImage, TranslatedMessage } from '../components';

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
            message='thanks header' />
        </div>
        <TranslatedMessage tag='p'
          style={styles.sectionText}
          message='thanks message'
          variables={{ name: this.props.user.name }} />
      </div>
    );
  }
});

