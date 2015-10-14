import React from 'react';
import t from 'tcomb-form';
import { Form, TranslatedMessage } from '../components';
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
    errors: React.PropTypes.object,
  },

  mixins: [Mixins.AsyncActions],


  getInitialState() {
    return { displayErrors: false };
  },

  getAsyncActions() {
    return {
      resetPassword: this.props.resetPassword,
    };
  },

  getType() {
    return t.struct({
      email: Email,
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
        autoFocus: true,
      },
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
    let m;
    let d;
    if (this.state.resetPasswordState === 'done') {
      m = translate('reset password button text when completed reset');
      d = true;
    } else if (this.state.resetPasswordState === 'pending') {
      m = translate('reset password button text when attempting reset');
      d = true;
    } else {
      m = translate('reset password button text');
      d = !!this.state.resetPasswordError;
    }

    return (
      <Form kind="compact"
        type={this.getType()}
        value={{ email: this.props.currentEmail }}
        fields={this.getFields()}
        submitMessage={m}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        disabled={d}
        autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically}
      />
    );
  },
});

