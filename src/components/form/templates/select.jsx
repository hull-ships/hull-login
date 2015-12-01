import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from '../form.css';

const Select = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired
  },

  handleChange(e) {
    this.props.onChange(e.target.value);
  },

  renderOptionsGroup() {
    // TODO
  },

  renderOption(o, i) {
    return (
      <option key={o.value + o.text + i} value={o.value}>{o.text}</option>
    );
  },

  render() {
    const options = this.props.options.map((o, i) => {
      return o.label ? this.renderOptionsGroup(o, i) : this.renderOption(o, i);
    });

    return (
      <select styleName="select" {...this.props} onChange={this.handleChange}>{options}</select>
    );
  },
});

export default cssModules(Select, styles);
