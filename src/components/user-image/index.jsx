import React from 'react';
import assign from 'object-assign';
import { getSettings } from '../../styles/settings';

const style = {
  width: 100,
  height: 100,
  overflow: 'hidden',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
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
    const s = assign({
      backgroundColor: settings.grayLighterColor,
      backgroundImage: 'url(' + url + ')'
    }, style);

    return (
      <div style={this.props.style}>
        <div style={s}/>
      </div>
    );
  }
});
