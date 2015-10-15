import React from 'react';
import cssModules from 'react-css-modules';
import styles from './user-image.css';

const UserImage = React.createClass({
  displayName: 'UserImage',

  propTypes: {
    src: React.PropTypes.string,
    style: React.PropTypes.object,
  },

  render() {
    const url = this.props.src;

    if (!url) { return <noscript />; }

    return (
      <div styleName="wrapper">
        <div styleName="image" style={{ backgroundImage: `url(${url})` }}/>
      </div>
    );
  },
});

export default cssModules(UserImage, styles);
