import React from 'react';
import cssModules from 'react-css-modules';
import styles from './sections.css';

import { UserImage, TranslatedMessage } from '../components';
import BaseSection from './base-section';


export default class ShowProfileSection extends BaseSection {

  renderContent() {
    const profileData = this.props.profileData;
    const fields = this.props.form.fields_list.map((f, i)=> {
      const isFirst = i === 0;
      const value = profileData[f.name] || f.value || '-';
      const styleName = isFirst ? 'field-first' : 'field';
      return (
        <div styleName={styleName} key={f.name}>
          <p styleName="field-title">{f.title}</p>
          <p styleName="field-value">{value}</p>
        </div>
      );
    }, this);

    return <div styleName="fields">{fields}</div>;
  }

  renderHeader() {
    const u = this.props.user;
    return (
      <div styleName="header">
        <UserImage styleName="user-image" src={u.picture} />
        <h1 styleName="title">{u.name || u.username || u.email}</h1>
        <p styleName="text">
          <TranslatedMessage tag="a"
            href="#"
            className={this.props.styles.link}
            onClick={this.props.activateEditProfileSection}
            message="view profile switch to edit profile link" />&nbsp;&nbsp;·&nbsp;&nbsp;<TranslatedMessage tag="a"
            href="#"
            className={this.props.styles.link}
            onClick={this.props.logOut}
            message="nav logout link" />
        </p>
      </div>
    );
  }

}

export default cssModules(ShowProfileSection, styles);
