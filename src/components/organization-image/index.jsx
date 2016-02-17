import React from 'react';
import cssModules from 'react-css-modules';
import styles from './organization-image.css';

const OrganizationImage = React.createClass({

  propTypes: {
    src: React.PropTypes.string,
    style: React.PropTypes.object
  },

  render() {
    const url = this.props.src;

    if (!url) { return <noscript />; }

    return (
      <div styleName="container">
        <img styleName="image" src={url} />
      </div>
    );
  }
});

export default cssModules(OrganizationImage, styles);
