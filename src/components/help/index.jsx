import React from 'react';
import cssModules from 'react-css-modules';
import styles from './help.css';

const Help = React.createClass({
  propTypes: {
    children: React.PropTypes.any
  },

  render() {
    if (!this.props.children) { return null;}
    return <span styleName="help">{this.props.children}</span>;
  }
});

export default cssModules(Help, styles);
