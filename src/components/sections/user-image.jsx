'use strict';

import React from 'react';
import assign from 'object-assign';
import { getSettings } from '../../styles/settings';

const style = {
  width: 100,
  height: 100,
  overflow: 'hidden',
  display: 'block',
  marginRight: 'auto',
  marginLeft: 'auto',
  borderRadius: 100
};

export default React.createClass({
  displayName: 'UserImage',

  render() {
    const url = this.props.src;

    if (!url) { return <noscript />; }

    const settings = getSettings();

    return (
      <div style={this.props.style}>
        <img src={url} style={style} alt={'Your profile picture'} />
      </div>
    );
  }
});

