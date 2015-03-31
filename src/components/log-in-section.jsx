import React from 'react';
import t from 'tcomb-form';
import { translate } from '../lib/i18n';
import { Email } from '../lib/types';
import SocialButtons from './social-buttons';
import Form from './form';

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
      <div className='text-center'>
        <h4>{translate('Login')}</h4>
        <p><a href="#" onClick={this.props.activateSignUpSection}>{translate('No Account?')}</a></p>
        <SocialButtons {...this.props} />
        <p><a href="#" onClick={this.props.activateResePasswordSection}>{translate('Forgot Password?')}</a></p>
      </div>
    );
  }
});

