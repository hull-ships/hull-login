'use strict';

import React from 'react';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';

export default React.createClass({
  displayName: 'Help',

  mixins: [
    StyleResolverMixin,
    BrowserStateMixin
  ],

  render() {
    return <span style={{display: 'block', 'textAlign': 'center', 'marginBottom': '10px'}}>
        {this.props.children}
    </span>;
  }
});
