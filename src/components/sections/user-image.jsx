'use strict';

import React from 'react';
import Dropzone from 'react-dropzone';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';
import assign from 'object-assign';
import { getSettings } from '../../styles/settings';
import { translate } from '../../lib/i18n';

const dropzoneStyle = {
  width: 100,
  height: 100,
  marginRight: 'auto',
  marginLeft: 'auto',
};

const linkStyle = {
  width: 100,
  height: 100,
  overflow: 'hidden',
  position: 'relative',
  display: 'block',
  textAlign: 'center',
  borderRadius: 100,
  transition: 'all 100ms cubic-bezier(0.700, 0.075, 0.025, 1.645)',

  states: [
    {
      hover: {
        transform: 'scale(1.1)'
        // borderRadius: 25,
      }
    }
  ]
};

const overlayStyle = {
  width: 100,
  height: 100,
  position: 'absolute',
  top: 0,
  left: 0,

  backgroundColor: 'rgba(0, 0, 0, 0.4)'
};

const editableImgStyle = {
  width: 100, 
  height: 100,
};

const imgStyle = {
  width: 100, 
  height: 100,
  overflow: 'hidden',
  display: 'block',
  marginRight: 'auto',
  marginLeft: 'auto',
  borderRadius: 100,
};

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

    let image = (
      <img {...this.getBrowserStateEvents()} 
        src={url} 
        style={this.buildStyles((this.props.editable) ? editableImgStyle : imgStyle)} 
        alt={translate('Your profile picture')} />
    );

    let output;
    if(this.props.editable) {
      output = (
        <Dropzone size={100} style={this.buildStyles(dropzoneStyle)}>
          <a {...this.getBrowserStateEvents()} style={this.buildStyles(linkStyle)} href={'#'} title={translate('Edit your profile picture')}>
            {image}
            <div style={overlayStyle}></div>
          </a>
        </Dropzone>
      );
    } else {
      output = image;
    }

    return (
      <div style={this.props.style}>
        {output}
      </div>
    );
  }
});

