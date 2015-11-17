import React from 'react';
import cssModules from 'react-css-modules';
import sectionsStyles from './sections.css';

import { UserImage, TranslatedMessage } from '../components';
import BaseSection from './base-section';


export default class ShowProfileSection extends BaseSection {

  renderContent() {
    const { hasForm, form, profileData} = this.props;
    if (hasForm) {
      const fields = form.fields_list.map((f, i)=> {
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
  }

  renderHeader() {
    const { user, styles, activateEditProfileSection, logOut } = this.props;
    return (
      <div styleName="header">
        <UserImage styleName="user-image" src={user.picture} />
        <h1 styleName="title">{user.name || user.username || user.email}</h1>
        <p styleName="text">
          <TranslatedMessage tag="a"
            href="#"
            className={styles.link}
            onClick={activateEditProfileSection}
            message="view profile switch to edit profile link" />&nbsp;&nbsp;·&nbsp;&nbsp;<TranslatedMessage tag="a"
            href="#"
            className={styles.link}
            onClick={logOut}
            message="nav logout link" />
        </p>
      </div>
    );
  }

}

export default cssModules(ShowProfileSection, sectionsStyles);
