import React from 'react';
import { getSettings } from '../../styles/settings';

const style = {
  width: 100,
  height: 100,
  overflow: 'hidden',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
  marginRight: 'auto',
  marginLeft: 'auto',
  borderRadius: 100,
};

export default React.createClass({
  displayName: 'UserImage',

  propTypes: {
    src: React.PropTypes.string,
    style: React.PropTypes.object,
  },

  render() {
    const url = this.props.src;

    if (!url) { return <noscript />; }

    const settings = getSettings();
    return (
      <div style={this.props.style}>
        <div style={{ backgroundColor: settings.grayLighterColor, backgroundImage: `url(${url})`, ...style}}/>
      </div>
    );
  },
});
