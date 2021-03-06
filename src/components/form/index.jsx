import React from 'react';
import t from 'tcomb-form/lib';
import Button from '../button';
import cssModules from 'react-css-modules';
import styles from './form.css';

import Templates from './templates';

const TCombForm = t.form.Form;

function testPlaceholder() {
  const element = document.createElement('input');
  return ('placeholder' in element);
}

const Form = React.createClass({

  displayName: 'Form',

  propTypes: {
    value: React.PropTypes.object,
    submitMessage: React.PropTypes.any,
    type: React.PropTypes.func.isRequired,
    fields: React.PropTypes.object,
    styles: React.PropTypes.object,
    disabled: React.PropTypes.bool,
    autoDisableSubmit: React.PropTypes.bool,
    onSubmit: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    kind: React.PropTypes.oneOf(['compact', 'expand'])
  },

  getInitialState() {
    return {
      valid: !!this.props.value,
      value: this.props.value || {},
      submitState: 'initial',
      expanded: false
    };
  },

  getOptions() {
    return {
      config: {
        kind: this.getKind(),
        submitState: this.state.submitState
      },
      fields: this.props.fields,
      auto: 'placeholders',
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
    const form = this.refs.form;
    if (form) return form.getValue();
  },

  handleChange(value) {
    const changes = { value, valid: !!this.getValue() };
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
    return !!this.state.valid;
  },
  isDisabled() {
    return !!this.props.disabled || (this.props.autoDisableSubmit && !this.isValid());
  },

  render() {
    const options = this.getOptions();

    if (options.config.kind === 'expand') {
      let form;
      let disabled = false;
      if (this.state.expanded) {
        disabled = this.isDisabled();
        form = (
          <TCombForm ref="form"
            type={this.props.type}
            options={options}
            value={this.state.value}
            onChange={this.handleChange} />
        );
      }

      return (
        <form styleName="form" onSubmit={this.handleSubmit}>
          {form}
          <Button block type="submit" disabled={disabled}>
            {this.props.submitMessage}</Button>
        </form>
      );
    }

    return (
      <form onSubmit={this.handleSubmit} styleName="form">
        <TCombForm ref="form"
          type={this.props.type}
          options={options}
          value={this.state.value}
          onChange={this.handleChange} />

        <div styleName="submit">
          <Button type="submit" block disabled={this.isDisabled()}>{this.props.submitMessage}</Button>
        </div>
      </form>
    );
  }
});

export default cssModules(Form, styles);
