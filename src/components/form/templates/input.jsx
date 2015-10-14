import React from 'react';
import { getStyles } from '../styles';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';

export default React.createClass({
  displayName: 'Input',

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    autoFocus: React.PropTypes.bool.isRequired,
  },

  mixins: [StyleResolverMixin, BrowserStateMixin],


  componentDidMount() {
    if (this.props.autoFocus) {
      setTimeout(()=> {
        if (this.isMounted()) {
          const input = this.refs.input;
          if (input) { input.focus(); }
        }
      }, 300);
    }
  },

  handleChange(e) {
    this.props.onChange(e.target.value);
  },

  render() {
    const props = {
      style: this.buildStyles(getStyles().formInput),
      ...this.getBrowserStateEvents(),
      ...this.props,
      onChange: this.handleChange,
    };
    return <input ref="input" {...props} />;
  },
});

