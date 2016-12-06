import React from 'react';
import Icon from '../components/icon';
import t from 'tcomb-form';
import { FieldTypes, I18n, Mixins } from '../lib';
import { TranslatedMessage, Form } from '../components';

const { Login, Password } = FieldTypes;
const { translate } = I18n;

export default React.createClass({
  displayName: 'LogInForm',

  propTypes: {
    logIn: React.PropTypes.func.isRequired,
    currentEmail: React.PropTypes.string,
    isWorking: React.PropTypes.bool,
    shipSettings: React.PropTypes.object.isRequired,
    updateCurrentEmail: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object,
    onFormChange: React.PropTypes.func.isRequired
  },

  mixins: [Mixins.AsyncActions],

  getInitialState() {
    return { displayErrors: false };
  },

  getAsyncActions() {
    return {
      logIn: this.props.logIn
    };
  },

  getType() {
    return t.struct({
      login: Login,
      password: Password
    });
  },

  getFields() {
    const e = this.props.errors.logIn;
    const { displayErrors } = this.state;
    const hasError = displayErrors && e && e.provider === 'classic';
    return {
      login: {
        placeholder: translate('log-in email placeholder'),
        label: translate('log-in email label'),
        type: 'text',
        help: <TranslatedMessage message="log-in email help text" />,
        hasError,
        error: hasError && translate('log-in invalid credentials error'),
        autoFocus: true
      },
      password: {
        placeholder: translate('log-in password placeholder'),
        label: translate('log-in password label'),
        type: 'password',
        help: <TranslatedMessage message="log-in password help text" />,
        hasError
      }
    };
  },

  handleSubmit(value) {
    this.setState({ displayErrors: true });
    this.getAsyncAction('logIn')(value);
  },

  handleChange(changes) {
    this.setState({ displayErrors: false });
    const { login } = changes.value;

    this.props.onFormChange(changes);
    if (login) {
      this.props.updateCurrentEmail(login);
    }
  },

  render() {
    let message;
    let disabled;
    if (this.props.isWorking || this.state.logInState === 'pending') {
      message = translate('log-in button text when attempting login');
      disabled = true;
    } else {
      message = <span><Icon name="lock" colorize/>{translate('log-in button text')}</span>;
      disabled = false;
    }


    const props = {
      kind: (this.props.shipSettings.show_classic_login_as_button) ? 'compact' : 'expand',
      type: this.getType(),
      fields: this.getFields(),
      submitMessage: message,
      onSubmit: this.handleSubmit,
      onChange: this.handleChange,
      disabled: disabled,
      value: { login: this.props.currentEmail }
    };

    return <Form {...props} autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically} />;
  }
});

