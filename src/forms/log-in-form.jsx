import React from 'react';
import t from 'tcomb-form';
import { FieldTypes, I18n, Mixins } from '../lib';
import { TranslatedMessage, Form } from '../components';

let { Login, Password } = FieldTypes;
let { translate } = I18n;

export default React.createClass({
  displayName: 'LogInForm',

  mixins: [
    Mixins.AsyncActions
  ],

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
        type: 'text',
        help: <TranslatedMessage message='log-in email help text' />,
        hasError,
        error: hasError && translate('log-in invalid credentials error'),
        autoFocus: true
      },
      password: {
        placeholder: translate('log-in password placeholder'),
        type: 'password',
        help: <TranslatedMessage message='log-in password help text' />,
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
    let { login } = changes.value;
    if (login) {
      this.props.updateCurrentEmail(login);
    }
  },

  render() {
    let m;
    let d;
    if (this.state.logInState === 'pending') {
      m = translate('log-in button text when attempting login');
      d = true;
    } else {
      m = translate('log-in button text');
      d = false;
    }


    let formProps = {
      kind: 'compact',
      type: this.getType(),
      fields: this.getFields(),
      submitMessage: m,
      onSubmit: this.handleSubmit,
      onChange: this.handleChange,
      disabled: d,
      value: { login: this.props.currentEmail }
    };

    return <Form {...formProps} autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically} />;
  }
});

