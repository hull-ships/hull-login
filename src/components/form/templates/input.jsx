'use strict';

import React from 'react';
import { getStyles } from '../styles';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';

import Help from '../../help';

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
    let s = this.buildStyles(getStyles().formInput);

    let help = null;
    if (this.props.help) {
      help = <Help>
        {this.props.help}
      </Help>;
    }

    return (
      <span>
        <input ref='input' style={s} {...this.getBrowserStateEvents()} {...this.props} onChange={this.handleChange} />
        {help}
      </span>
    );
  }
});

