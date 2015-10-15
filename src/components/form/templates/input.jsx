import React from 'react';
import cssModules from 'react-css-modules';
import styles from '../form.css';

const Input = React.createClass({
  displayName: 'Input',

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    attrs: React.PropTypes.object.isRequired,
    autoFocus: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
  },

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
      ...this.props,
      onChange: this.handleChange,
    };
    return <input styleName="input" ref="input" {...props} placeholder={this.props.attrs.placeholder} />;
  },
});

export default cssModules(Input, styles);
