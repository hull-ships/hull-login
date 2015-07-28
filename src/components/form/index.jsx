'use strict';

import React from 'react';
import t from './t';
import Button from '../button';

const TCombForm = t.form.Form;

function testPlaceholder() {
  let element = document.createElement('input');

  return ('placeholder' in element);
}

export default React.createClass({
  displayName: 'Form',

  getInitialState() {
    return {
      value: this.props.value || {},
      submitState: 'initial',
      valid: false
    };
  },

  getOptions() {
    return {
      config: {
        kind: this.getKind(),
        submitState: this.state.submitState
      },
      fields: this.props.fields
    };
  },

  getKind() {
    if (this.props.kind === 'compact' && testPlaceholder()) {
      return 'compact';
    }

    return 'default';
  },

  handleChange(value) {
    this.setState({ value });
    this.setState({ valid: this.refs.form.getValue() !== null });
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
        <Button style={s} type='submit' kind='primary' block={true} disabled={!!this.props.disabled || (this.props.autoDisableSubmit && !this.state.valid)}>{this.props.submitMessage}</Button>
      </form>
    );
  }
});

