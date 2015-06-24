'use strict';

import React from 'react';
import { getStyles } from './styles';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';

export default React.createClass({
  displayName: 'Button',

  mixins: [
    StyleResolverMixin,
    BrowserStateMixin
  ],

  renderIcon() {
    if (this.props.icon == null) { return; }
  },

  render() {
    let styles = getStyles();
    let s = this.buildStyles(styles.button);
    let icon = this.renderIcon();
    let children = icon == null ? this.props.children : [icon, this.props.children];

    return (
      <button {...this.getBrowserStateEvents()} {...this.props} style={s}>{children}</button>
    );
  }
});

