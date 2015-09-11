import { reduce, include } from 'underscore';
import React from 'react';
import { I18n, Mixins } from '../lib';
import transform from 'tcomb-json-schema';
import { Form, TranslatedMessage } from '../components';

let { translate } = I18n;

function getHelpMessage(v) {
  if (typeof v.help === 'string') { return v.help; }

  let m;
  if (v.minLength > 1 && v.maxLength > 1) {
    m = 'form help string between';
  } else if (v.minLength > 1) {
    m = 'form help string min';
  } else if (v.maxLength) {
    m = 'form help string max';
  }

  if (m != null) {
    return <TranslatedMessage message={m} variables={v} />;
  }
}

export default React.createClass({
  displayName: 'EditProfileForm',

  mixins: [
    Mixins.AsyncActions
  ],

  getAsyncActions() {
    return {
      updateUser: this.props.updateUser
    };
  },

  getDefaultSchema() {
    let properties = {};

    if (this.props.shipSettings.split_name_field) {
      properties.first_name = {
        type: 'string',
        title: translate('edit profile first_name field')
      };
      properties.last_name = {
        type: 'string',
        title: translate('edit profile last_name field')
      };
    } else {
      properties.name = {
        type: 'string',
        title: translate('edit profile name field')
      };
    }

    if (!this.props.isShopifyCustomer) {
      properties.email = {
        'type': 'string',
        'title': translate('edit profile email field'),
        'format': 'email',
        'minLength': 1
      };
      properties.password = {
        'type': 'string',
        'title': translate('edit profile password field'),
        'format': 'password',
        'help': <TranslatedMessage message='edit profile password help text' />
      };
    }

    return {
      '$schema': 'http://json-schema.org/draft-04/schema#',
      'type': 'object',
      'properties': properties,
      'required': [
        'name',
        'email'
      ]
    };
  },

  getSchema() {
    let s = this.getDefaultSchema();

    if (!this.props.hasForm) { return s; }

    if (this.props.formIsSubmitted) {
      return {
        type: 'object',
        properties: {
          ...s.properties,
          ...this.props.form.fields_schema.properties
        },
        required: s.required.concat(this.props.form.fields_schema.required)
      };
    }

    return this.props.form.fields_schema;
  },

  getType() {
    return transform(this.getSchema());
  },

  getFields() {
    let schema = this.getSchema();
    let errors = ((this.props.errors || {}).updateUser || {}).errors || {};

    return reduce(schema.properties, function(m, v, k) {
      let label = v.title;
      let isRequired = include(schema.required, k);
      if (isRequired) { label += ' *'; }

      let help = v.help || getHelpMessage(v);

      let f = {
        label,
        help,
        hasError: !!errors[k]
      };

      if (v.type === 'string') {
        f.type = v.format === 'uri' ? 'url' : (v.format || 'text');
      }

      m[k] = f;

      return m;
    }, {});
  },

  handleSubmit(value) {
    this.getAsyncAction('updateUser')(value);
  },

  render() {
    let button = '';
    let disabled = false;

    if (this.props.formIsSubmitted || !this.props.hasForm) {
      button = translate('edit profile button text');
    } else {
      button = translate('edit profile button text when profile incomplete');
    }

    if (this.state.updateUserState === 'pending') {
      button = translate('edit profile button text when attempting edit');
      disabled = true;
    }

    return <Form type={this.getType()}
      fields={this.getFields()}
      value={this.props.profileData}
      submitMessage={button}
      onSubmit={this.handleSubmit}
      disabled={disabled}
      autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically} />;
  }
});
