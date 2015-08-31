import React from 'react';
import { getStyles } from '../styles';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';

export default React.createClass({
  displayName: 'Textarea',

  mixins: [
    StyleResolverMixin,
    BrowserStateMixin
  ],

  handleChange(e) {
    this.props.onChange(e.target.value);
  },

  render() {
    const s = this.buildStyles(getStyles().formTextarea);

    return (
      <textarea style={s} {...this.getBrowserStateEvents()} {...this.props} onChange={this.handleChange} />
    );
  }
});

