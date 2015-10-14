import React from 'react';
import cssModules from 'react-css-modules';
import styles from '../form.css';

const Textarea = React.createClass({

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
  },

  handleChange(e) {
    this.props.onChange(e.target.value);
  },

  render() {
    return (
      <textarea styleName="textarea" {...this.getBrowserStateEvents()} {...this.props} onChange={this.handleChange} />
    );
  },
});

export default cssModules(Textarea, styles);
