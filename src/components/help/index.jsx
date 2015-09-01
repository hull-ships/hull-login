import React from 'react';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';

const styles = {
  display: 'block',
  textAlign: 'center',
  fontSize: 12,
  marginTop: 0,
  marginBottom: 10,
  opacity: 0.5
};

export default React.createClass({
  displayName: 'Help',

  mixins: [
    StyleResolverMixin,
    BrowserStateMixin
  ],

  render() {
    return <span style={styles}>
      {this.props.children}
    </span>;
  }
});
