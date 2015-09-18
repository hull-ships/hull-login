import React from 'react';
import t from 'tcomb-form';
import { FieldTypes, I18n, Mixins } from '../lib';
import { TranslatedMessage, Form } from '../components';
import _ from 'underscore';

let { Name, Email, Password } = FieldTypes;
let { translate } = I18n;

export default React.createClass({
  displayName: 'SignUpForm',

  mixins: [
    Mixins.AsyncActions
  ],

  getInitialState() {
    return { displayErrors: false };
  },

  getAsyncActions() {
    return {
      signUp: this.props.signUp
    };
  },

  getNameFields() {
    if (!this.props.shipSettings.show_name_field_on_sign_up) { return []; }

    if (this.props.shipSettings.split_name_field) {
      return ['first_name', 'last_name'];
    }

    return ['name'];
  },

  getType() {
    let p = _.reduce(this.getNameFields(), (m, f) => {
      m[f] = Name;
      return m;
    }, {});

    return t.struct({
      ...p,
      email: Email,
      password: Password
    });
  },

  getFields() {
    let { displayErrors } = this.state;
    let errors = ((this.props.errors.signUp || {}).errors || {});

    let p = _.reduce(this.getNameFields(), (m, f) => {
      m[f] = {
        placeholder: translate(`sign-up ${f} placeholder`),
        type: 'text',
        help: <TranslatedMessage message={`sign-up ${f} help text`} />,
        hasError: displayErrors && !!errors.name,
        error: displayErrors && errors[f] && translate(['sign-up name', errors[f], 'error'].join(' ')),
        autoFocus: true
      };

      return m;
    }, {});

    return {
      ...p,
      email: {
        placeholder: translate('sign-up email placeholder'),
        type: 'email',
        help: <TranslatedMessage message='sign-up email help text' />,
        hasError: displayErrors && !!errors.email,
        error: displayErrors && errors.email && translate(['sign-up email', errors.email, 'error'].join(' '))
      },
      password: {
        placeholder: translate('sign-up password placeholder'),
        type: 'password',
        help: <TranslatedMessage message='sign-up password help text' />,
        hasError: displayErrors && !!errors.password,
        error: displayErrors && errors.password && translate('sign-up password too short error')
      }
    };
  },

  handleSubmit(value) {
    this.setState({ displayErrors: true });
    this.getAsyncAction('signUp')(value);
  },

  handleChange(changes) {
    this.setState({ displayErrors: false });
    let { email } = changes.value;
    if (email) {
      this.props.updateCurrentEmail(email);
    }
  },

  render() {
    let m;
    let d;
    if (this.state.signUpState === 'pending') {
      m = translate('sign-up button text when attempting sign-up');
      d = true;
    } else {
      m = translate('sign-up button text');
      d = false;
    }

    let formProps = {
      kind: (this.props.shipSettings.show_classic_login_as_button) ? 'expand' : 'compact',
      type: this.getType(),
      fields: this.getFields(),
      submitMessage: m,
      onSubmit: this.handleSubmit,
      onChange: this.handleChange,
      disabled: d,
      value: { email: this.props.currentEmail }
    };

    return <Form {...formProps} autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically} />;
  }
});
