import React from 'react';
import t from 'tcomb-form';
import { translate } from '../lib/i18n';
import { Email } from '../lib/types';
import Form from './form';

export default React.createClass({
  getType: function() {
    var type = t.struct({
      email: Email,
    });

    return type;
  },

  getOptions: function() {
    var options = {
      auto: 'placeholders',
      fieldset: false,
      fields: {
        email: {
          placeholder: translate('Your email'),
        }
      }
    };

    return options;
  },

  handleSubmit: function(value) {
    this.props.resetPassword(value && value.email);
  },

  render: function() {
    return (
      <div className='text-center'>
        <h4>{translate('Reset your password')}</h4>
        <p><a href="#" onClick={this.props.activateLogInSection}>{translate('Know your password? Log in.')}</a></p>

        <Form type={this.getType()} options={this.getOptions()} submitMessage={translate('Send password reset email')} onSubmit={this.handleSubmit} />
      </div>
    );
  }
});

