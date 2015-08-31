import React from 'react';
import Bounce from 'bounce';
import t from 'tcomb-form/lib';
import Button from '../button';

import Templates from './templates';

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
      fields: this.props.fields,
      templates: Templates
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


  getValue() {
    let form = this.refs.form;
    if (form) return form.getValue();
  },

  handleChange(value) {
    let changes = { value, valid: this.getValue() !== null };
    this.setState(changes);
    if (this.props.onChange) {
      this.props.onChange(changes);
    }
  },

  handleSubmit(e) {
    e.preventDefault();

    if (this.getKind() === 'expand' && !this.state.expanded) {
      this.setState({ expanded: true });
      return;
    }

    let value = this.getValue();
    if (value) { this.props.onSubmit(value); }
  },

  componentDidMount() {
    this.state.enterTransition.define('slide');
    let { value } = this.state;
    return value && this.setState({ valid: true });
  },

  componentWillUnmount() {
    this.state.enterTransition.remove();
  },

  isDisabled() {
    return !!this.props.disabled || (this.props.autoDisableSubmit && !this.state.valid);
  },

  render() {
    const options = this.getOptions();
    const s = { marginTop: options.config.kind === 'compact' ? 10 : 30 };

    if (options.config.kind === 'expand') {
      let form;
      let disabled = false;
      if (this.state.expanded) {
        disabled = this.isDisabled();
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
            disabled={disabled}>
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
        <Button style={s} type='submit' kind='primary' block={true} disabled={this.isDisabled()}>{this.props.submitMessage}</Button>
      </form>
    );
  }
});
