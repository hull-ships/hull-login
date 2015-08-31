import React from 'react';
import { UserImage, TranslatedMessage } from '../components';
import BaseSection from './base-section';


export default class ShopProfileSection extends BaseSection {

  renderContent() {
    let settings = this.getStylesSettings();
    let fields = this.props.form.fields_list.map(function(f, i) {
      const isFirst = i === 0;

      let fieldStyle = { padding: 10 };
      if (!isFirst) {
        fieldStyle.borderTopWidth = 1;
        fieldStyle.borderTopStyle = 'solid';
        fieldStyle.borderTopColor = settings.grayLightColor;
      }

      const labelStyle = {
        color: settings.grayDarkerColor,
        fontWeight: 'bold'
      };

      return (
        <div className='hull-login__profile-field' key={f.name} style={fieldStyle}>
          <p className='hull-login__profile-field__title' style={labelStyle}>{f.title}</p>
          <p className='hull-login__profile-field__value'>{f.value || '-'}</p>
        </div>
      );
    }, this);

    const fieldsStyle = {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: settings.grayLightColor,
      borderRadius: settings.mediumBorderRadius,
      boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.02)',
      borderTopColor: settings.grayColor,
      background: settings.grayLighterColor
    };

    return (
      <div className='hull-login__profile-summary' style={fieldsStyle}>{fields}</div>
    );
  }

  renderHeader(styles) {
    const u = this.props.user;
    return <div style={styles.sectionHeader} className='hull-login__profile-header'>
      <UserImage style={styles.sectionUserImage} src={u.picture} />
      <h1 style={styles.sectionTitle}>{u.name || u.username || u.email}</h1>
      <p style={styles.sectionText} className='hull-login__profile-edit-link'>
        <TranslatedMessage tag='a'
          href='#'
          onClick={this.props.activateEditProfileSection}
          message='view profile switch to edit profile link' />
      </p>
    </div>;
  }

}

