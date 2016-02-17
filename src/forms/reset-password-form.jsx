import React from 'react';
import t from 'tcomb-form';
import { Form, TranslatedMessage } from '../components';
import Icon from '../components/icon';
import { Mixins, I18n, FieldTypes } from '../lib';

const { translate } = I18n;
const { Email } = FieldTypes;

export default React.createClass({
  displayName: 'ResetPasswordSection',

  propTypes: {
    resetPassword: React.PropTypes.func.isRequired,
    currentEmail: React.PropTypes.string,
    shipSettings: React.PropTypes.object.isRequired,
    updateCurrentEmail: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object
  },

  mixins: [Mixins.AsyncActions],


  getInitialState() {
    return { displayErrors: false };
  },

  getAsyncActions() {
    return {
      resetPassword: this.props.resetPassword
    };
  },

  getType() {
    return t.struct({
      email: Email
    });
  },

  getFields() {
    const hasError = this.state.displayErrors && !!this.props.errors.resetPassword;
    const errorMessage = this.props.errors.resetPassword && this.props.errors.resetPassword.message;

    let help;
    if (this.state.resetPasswordState === 'done') {
      help = <TranslatedMessage message="reset password message when completed reset" />;
    } else if (this.state.resetPasswordError) {
      help = <TranslatedMessage message={errorMessage} />;
    }

    return {
      email: {
        placeholder: translate('reset password email placeholder'),
        type: 'email',
        hasError,
        error: hasError && <TranslatedMessage message={errorMessage} />,
        help,
        autoFocus: true
      }
    };
  },

  handleSubmit(value) {
    this.getAsyncAction('resetPassword')(value.email);
  },

  handleChange(changes) {
    const { email } = changes.value;
    if (email) {
      this.props.updateCurrentEmail(email);
    }
    this.setState({ displayErrors: false });
  },

  render() {
    let message;
    let disabled;
    if (this.state.resetPasswordState === 'done') {
      message = <span><Icon name="valid" colorize/>{translate('reset password button text when completed reset')}</span>;
      disabled = true;
    } else if (this.state.resetPasswordState === 'pending') {
      message = <span><Icon name="spinner" colorize/>{translate('reset password button text when attempting reset')}</span>;
      disabled = true;
    } else {
      message = <span><Icon name="send" colorize/>{translate('reset password button text')}</span>;
      disabled = !!this.state.resetPasswordError;
    }

    return (
      <Form kind="compact"
        type={this.getType()}
        value={{ email: this.props.currentEmail }}
        fields={this.getFields()}
        submitMessage={message}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        disabled={disabled}
        autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically}
      />
    );
  }
});

