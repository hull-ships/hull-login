import React from 'react';
import { getStyles } from './styles';
import { getSettings } from '../styles/settings';


export default class BaseSection extends React.Component {

  getStyles() {
    return getStyles();
  }

  getStylesSettings() {
    return getSettings();
  }

  renderHeader(/* styles */) {

  }

  renderFooter(/* styles */) {

  }

  renderContent(/* styles */) {

  }

  render() {
    const styles = this.getStyles();
    return (
      <div>
        {this.renderHeader(styles)}
        {this.renderContent(styles)}
        {this.renderFooter(styles)}
      </div>
    );
  }
}

