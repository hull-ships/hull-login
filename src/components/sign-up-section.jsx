import React from 'react';
import t from 'tcomb-form';
import { translate } from '../lib/i18n';
import { Email } from '../lib/types';
import SocialButtons from './social-buttons';
import Form from './form';

export default React.createClass({
  getType: function() {
    var type = t.struct({
      name: t.Str,
      email: Email,
      password: t.Str
    });

    return type;
  },

  getOptions: function() {
    var options = {
      auto: 'placeholders',
      fieldset: false,
      fields: {
        name: {
          placeholder: translate('Your name'),
        },
        email: {
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
    this.props.signUp(value && value);
  },

  render: function() {
    return (
      <div className='text-center'>
        <h4>{translate('Join {organization}', { organization: this.props.organization.name })}</h4>
        <p><a href="#" onClick={this.props.activateLogInSection}>{translate('Already have an account? Log in.')}</a></p>
        <hr/>
        <Form type={this.getType()} options={this.getOptions()} submitMessage={translate('Sign up')} onSubmit={this.handleSubmit} />
        <hr/>
        <SocialButtons {...this.props} />
        <hr/>
        <p className='light'><small>{translate("By signing up, you agree to {organization}'s Terms of Service.", { organization: this.props.organization.name })}</small></p>
      </div>
    );
  }
});

