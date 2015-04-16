'use strict';

import React from 'react';
import styles from '../styles';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';

export default React.createClass({
  displayName: 'Input',

  mixins: [
    StyleResolverMixin,
    BrowserStateMixin
  ],

  handleChange(e) {
    this.props.onChange(e.target.value);
  },

  render() {
    var s = this.buildStyles(styles.formInput);

    return (
      <input style={s} {...this.getBrowserStateEvents()} {...this.props} onChange={this.handleChange} />
    );
  }
});

