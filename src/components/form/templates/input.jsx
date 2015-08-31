import React from 'react';
import { getStyles } from '../styles';
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

  componentDidMount() {
    if (this.props.autoFocus) {
      setTimeout(()=> {
        if (this.isMounted()) {
          let input = this.refs.input;
          if (input) {
            let node = input.getDOMNode();
            node.focus();
          }
        }
      }, 300);
    }
  },

  render() {
    let props = {
      style: this.buildStyles(getStyles().formInput),
      ...this.getBrowserStateEvents(),
      ...this.props,
      onChange: this.handleChange
    }
    return <input ref='input' {...props} />;
  }
});

