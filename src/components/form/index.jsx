import React from 'react';
import Bounce from 'bounce';
import t from 'tcomb-form/lib';
import Button from '../button';

import Templates from './templates';

const TCombForm = t.form.Form;

function testPlaceholder() {
  const element = document.createElement('input');
  return ('placeholder' in element);
}

export default React.createClass({

  displayName: 'Form',

  propTypes: {
    value: React.PropTypes.object,
    submitMessage: React.PropTypes.string,
    type: React.PropTypes.func.isRequired,
    fields: React.PropTypes.object,
    disabled: React.PropTypes.bool,
    autoDisableSubmit: React.PropTypes.bool,
    onSubmit: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    kind: React.PropTypes.oneOf(['compact', 'expand']),
  },

  getInitialState() {
    return {
      value: this.props.value || {},
      submitState: 'initial',
      expanded: false,
      enterTransition: new Bounce().scale({
        from: { x: 1, y: 0 },
        to: { x: 1, y: 1 },
        bounces: 3,
        easing: 'hardbounce',
        duration: 1000,
      }),
    };
  },

  componentDidMount() {
    this.state.enterTransition.define('slide');
    // const { value } = this.state;
    // return value && this.setState({ valid: true });
  },

  componentWillUnmount() {
    this.state.enterTransition.remove();
  },


  getOptions() {
    return {
      config: {
        kind: this.getKind(),
        submitState: this.state.submitState,
      },
      fields: this.props.fields,
      templates: Templates,
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
    const form = this.refs.form;
    if (form) return form.getValue();
  },

  handleChange(value) {
    const changes = { value, valid: this.isValid() };
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

    const value = this.getValue();
    if (value) { this.props.onSubmit(value); }
  },

  isValid() {
    return this.getValue() === null;
  },
  isDisabled() {
    return !!this.props.disabled || (this.props.autoDisableSubmit && !this.isValid());
  },

  render() {
    const options = this.getOptions();
    const s = { marginTop: options.config.kind === 'compact' ? 10 : 30 };

    if (options.config.kind === 'expand') {
      let form;
      let disabled = false;
      if (this.state.expanded) {
        disabled = this.isDisabled();
        form = (
          <div style={{animation: 'slide 1s linear both'}}>
            <TCombForm ref="form"
              type={this.props.type}
              options={options}
              value={this.state.value}
              onChange={this.handleChange} />
          </div>
        );
      }

      return (
        <form onSubmit={this.handleSubmit}>
          {form}
          <Button style={s}
            block
            type="submit"
            kind="primary"
            disabled={disabled}>
            {this.props.submitMessage}</Button>
        </form>
      );
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <TCombForm ref="form"
          type={this.props.type}
          options={options}
          value={this.state.value}
          onChange={this.handleChange} />
        <Button style={s} type="submit" kind="primary" block disabled={this.isDisabled()}>{this.props.submitMessage}</Button>
      </form>
    );
  },
});
