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
    if(!this.props.shipSettings.appearance.social_only){
      return (
        <div className='text-center'>
          <h4>{translate('Join {organization}', { organization: this.props.organization.name })}</h4>
          <p><a href="#" onClick={this.props.activateLogInSection}>{translate('Already have an account? Log in.')}</a></p>
          <hr/>

          <div className="row">
            <div className="medium-12 large-6 columns">
              <SocialButtons {...this.props} />
              <hr className='hide-for-large-up'/>
            </div>
            <div className="medium-12 large-6 columns">
              <Form type={this.getType()} options={this.getOptions()} submitMessage={translate('Sign up')} onSubmit={this.handleSubmit} />
            </div>
          </div>

          <hr className='show-for-large-up'/>

          <p className='light'><small>{translate("By signing up, you agree to {organization}'s Terms of Service.", { organization: this.props.organization.name })}</small></p>
        </div>
      );
    } else {
      return <div className='text-center'>
        <h4>{translate('Join {organization}', { organization: this.props.organization.name })}</h4>
        <hr/>
        <SocialButtons {...this.props} />
        <hr className='show-for-large-up'/>
        <p className='light'><small>{translate("By signing up, you agree to {organization}'s Terms of Service.", { organization: this.props.organization.name })}</small></p>
      </div>
    }
  }
});

