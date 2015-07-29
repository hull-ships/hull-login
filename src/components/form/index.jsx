'use strict';

import React from 'react';
import Bounce from 'bounce';
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
      valid: false,
      expanded: false,
      enterTransition: new Bounce().scale({
        from: { x: 1, y: 0 },
        to: { x: 1, y: 1 },
        bounces: 3,
        easing: 'hardbounce',
        duration: 1000
      })
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

    if (this.props.kind === 'expand') {
      return 'expand';
    }

    return 'default';
  },

  handleChange(value) {
    this.setState({ value });
    this.setState({ valid: this.refs.form.getValue() !== null });
  },

  handleSubmit(e) {
    e.preventDefault();

    if (this.getKind() === 'expand' && !this.state.expanded) {
      this.setState({ expanded: true });
      return;
    }

    const value = this.refs.form.getValue();
    if (value) { this.props.onSubmit(value); }
  },

  componentDidMount() {
    this.state.enterTransition.define('slide');
  },

  componentWillUnmount() {
    this.state.enterTransition.remove();
  },

  render() {
    const options = this.getOptions();
    const s = { marginTop: options.config.kind === 'compact' ? 10 : 30 };

    if (options.config.kind === 'expand') {
      let form;
      if (this.state.expanded) {
        form = <div style={{animation: 'slide 1s linear both'}}>
          <TCombForm ref='form'
            type={this.props.type}
            options={options}
            value={this.state.value}
            onChange={this.handleChange} />
        </div>;
      }


      return (
        <form onSubmit={this.handleSubmit}>
          {form}
          <Button style={s}
            type='submit'
            kind='primary'
            block={true}
            disabled={!!this.props.disabled || (this.props.autoDisableSubmit && !this.state.valid)}>
            {this.props.submitMessage}</Button>
        </form>
      );
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <TCombForm ref='form'
          type={this.props.type}
          options={options}
          value={this.state.value}
          onChange={this.handleChange} />
        <Button style={s} type='submit' kind='primary' block={true} disabled={!!this.props.disabled || (this.props.autoDisableSubmit && !this.state.valid)}>{this.props.submitMessage}</Button>
      </form>
    );
  }
});

