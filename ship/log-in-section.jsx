import React from 'react';
import t from 'tcomb-form';
import { translate } from './i18n';
import { Email } from './types';
import SocialButtons from './social-buttons.jsx';
import Form from './form.jsx';

export default React.createClass({
  getType: function() {
    var type = t.struct({
      login: Email,
      password: t.Str
    });

    return type;
  },

  getOptions: function() {
    var options = {
      auto: 'placeholders',
      fieldset: false,
      fields: {
        login: {
          placeholder: translate('Your email'),
        },
        password: {
          placeholder: translate('Your password'),
          type: 'password'
        }
      }
    };

    return options;
  },

  handleSubmit: function(value) {
    this.props.logIn(value && value);
  },

  render: function() {
    return (
      <div>
        <h1>{translate('Welcome back!')}</h1>
        <p><a href="#" onClick={this.props.activateSignUpSection}>{translate('Do not have an account?')}</a></p>

        <Form type={this.getType()} options={this.getOptions()} submitMessage={translate('Log in')} onSubmit={this.handleSubmit} />
        <SocialButtons {...this.props} />

        <p><a href="#" onClick={this.props.activateResePasswordSection}>{translate('Forgot your password?')}</a></p>
      </div>
    );
  }
});

