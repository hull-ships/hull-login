'use strict';

import React from 'react';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';
import assign from 'object-assign';
import { getSettings } from '../../styles/settings';
import { translate } from '../../lib/i18n';

const linkStyle = {
  width: 100,
  height: 100,
  overflow: 'hidden',
  display: 'block',
  marginRight: 'auto',
  marginLeft: 'auto',
  borderRadius: 100,

  states: [
    {
      hover: {
        transform: 'scale(1.1)'
      }
    }
  ]
};

const imgStyle = {
  width: 100, 
  height: 100,

  states: [
    {
      hover: {
        // transform: 'scale(1.1)'
      }
    }
  ]
}

export default React.createClass({
  displayName: 'UserImage',

  mixins: [
    StyleResolverMixin,
    BrowserStateMixin
  ],

  render() {
    const url = this.props.src;

    if (!url) { return <noscript />; }

    const settings = getSettings();

    return (
      <div style={this.props.style}>
        <a {...this.getBrowserStateEvents()} style={this.buildStyles(linkStyle)} href={'#'} title={translate('Edit your profile picture')}>
          <img {...this.getBrowserStateEvents()} src={url} style={this.buildStyles(imgStyle)} alt={translate('Your profile picture')} />
        </a>
      </div>
    );
  }
});

