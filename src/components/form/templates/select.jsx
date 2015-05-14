'use strict';

import React from 'react';
import { getStyles } from '../styles';
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

  renderOption(o, i) {
    return (
      <option key={o.value + o.text + i} value={o.value}>{o.text}</option>
    );
  },

  render() {
    const s = this.buildStyles(getStyles().formSelect);

    const options = this.props.options.map((o, i) => {
      return o.label ? this.renderOptionsGroup(o, i) : this.renderOption(o, i);
    });

    return (
      <select style={s} {...this.getBrowserStateEvents()} {...this.props} onChange={this.handleChange}>{options}</select>
    );
  }
});

