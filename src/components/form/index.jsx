'use strict';

import React from 'react';
import t from './t';
import Button from '../button';
import styles from './styles';

const TCombForm = t.form.Form;

export default React.createClass({
  displayName: 'Form',

  getInitialState() {
    return {
      value: this.props.value || {},
      submitState: 'initial'
    }
  },

  getOptions() {
    return {
      config: {
        kind: this.props.kind,
        submitState: this.state.submitState
      },
      fields: this.props.fields
    };
  },

  handleChange(value) {
    this.setState({ value });
  },

  handleSubmit(e) {
    e.preventDefault();

    const value = this.refs.form.getValue();
    if (value) { this.props.onSubmit(value); }
  },

  render() {
    const options = this.getOptions();
    const s = { marginTop: options.config.kind === 'compact' ? 10 : 30 };

    return (
      <form onSubmit={this.handleSubmit}>
        <TCombForm ref='form' type={this.props.type} options={options} value={this.state.value} onChange={this.handleChange} />
        <Button style={s} type='submit' kind='primary' block={true} disabled={!!this.props.disabled}>{this.props.submitMessage}</Button>
      </form>
    );
  }
});

