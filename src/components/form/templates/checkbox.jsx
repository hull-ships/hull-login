import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from '../form.css';

const Checkbox = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
  },

  handleChange(e) {
    this.props.onChange(e.target.checked);
  },

  render() {
    return (
      <label>
        <input {...this.props} type="checkbox" onChange={this.handleChange} />
        <span styleName="label">{this.props.label}</span>
      </label>
    );
  }
});

export default cssModules(Checkbox, styles);
