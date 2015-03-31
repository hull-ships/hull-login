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
    if(!this.props.shipSettings.appearance.social_only){
      return (
        <div className='text-center'>
          <h4>{translate('Login')}</h4>
          <p><a href="#" onClick={this.props.activateSignUpSection}>{translate('No Account?')}</a></p>
          <hr/>
          <div className="row">
            <div className="medium-12 large-6 columns">
              <SocialButtons {...this.props} />
              <hr className='hide-for-large-up'/>
            </div>
            <div className="medium-12 large-6 columns">
              <Form type={this.getType()} options={this.getOptions()} submitMessage={translate('Log in')} onSubmit={this.handleSubmit} />
            </div>
          </div>
          <hr className='show-for-large-up'/>
          <p><a href="#" onClick={this.props.activateResetPasswordSection}>{translate('Forgot Password?')}</a></p>
        </div>
      );
    } else {
      return (
        <div className='text-center'>
          <img src="https://neuestrap.s3.amazonaws.com/releases/neue/f00d62eb5b34afb6f5ea17703f8a1702f0dd26a3/images/avatar@2x.png" width="50px"/>
          <h4>{translate('Login')}</h4>
          <hr/>
          <SocialButtons {...this.props} />
        </div>
      );
    }
  }
});

