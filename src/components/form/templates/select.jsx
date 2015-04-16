'use strict';

import React from 'react';
import styles from '../styles';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';

export default React.createClass({
  displayName: 'Select',

  mixins: [
    StyleResolverMixin,
    BrowserStateMixin
  ],

  handleChange(e) {
    this.props.onChange(e.target.value);
  },

  renderOptionsGroup(o) {
    // TODO
  },

  renderOption(o) {
    return (
      <option value={o.value}>{o.text}</option>
    );
  },

  render() {
    const s = this.buildStyles(styles.formSelect);

    const options = this.props.options.map((o) => {
      return o.label ? this.renderOptionsGroup(o) : this.renderOption(o);
    });

    return (
      <select style={s} {...this.getBrowserStateEvents()} {...this.props} onChange={this.handleChange}>{options}</select>
    );
  }
});

