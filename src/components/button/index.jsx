'use strict';

import React from 'react';
import styles from './styles';
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
    var s = this.buildStyles(styles.button);

    var icon = this.renderIcon();
    var children = icon == null ? this.props.children : [icon, this.props.children];

    return (
      <button {...this.getBrowserStateEvents()} {...this.props} style={s}>{children}</button>
    );
  }
});

