import _ from 'lodash';
import React from 'react';
import Icon from '../components/icon';
import { I18n, Mixins } from '../lib';
import transform from 'tcomb-json-schema';
import { Form, TranslatedMessage } from '../components';

const { translate } = I18n;

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

  if (!!m) {
    return <TranslatedMessage message={m} variables={v} />;
  }
}

export default React.createClass({
  displayName: 'EditProfileForm',

  propTypes: {
    logIn: React.PropTypes.func.isRequired,
    isShopifyCustomer: React.PropTypes.bool,
    hasForm: React.PropTypes.bool,
    formIsSubmitted: React.PropTypes.bool,
    shipSettings: React.PropTypes.object.isRequired,
    profileData: React.PropTypes.object.isRequired,
    form: React.PropTypes.object.isRequired,
    updateUser: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object,
  },

  mixins: [Mixins.AsyncActions ],

  getAsyncActions() {
    return {
      updateUser: this.props.updateUser,
    };
  },

  getDefaultSchema() {
    const properties = {};

    if (this.props.shipSettings.split_name_field) {
      properties.first_name = {
        type: 'string',
        title: translate('edit profile first_name field'),
      };
      properties.last_name = {
        type: 'string',
        title: translate('edit profile last_name field'),
      };
    } else {
      properties.name = {
        type: 'string',
        title: translate('edit profile name field'),
      };
    }

    if (!this.props.isShopifyCustomer) {
      properties.email = {
        type: 'string',
        title: translate('edit profile email field'),
        format: 'email',
        minLength: 1,
      };
      properties.password = {
        type: 'string',
        title: translate('edit profile password field'),
        format: 'password',
        help: <TranslatedMessage message="edit profile password help text" />,
      };
    }

    return {
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: 'object',
      properties: properties,
      required: ['name', 'email'],
    };
  },

  getSchema() {
    const schema = this.getDefaultSchema();

    if (!this.props.hasForm) { return schema; }

    if (this.props.formIsSubmitted) {
      return {
        type: 'object',
        properties: {
          ...schema.properties,
          ...this.props.form.fields_schema.properties,
        },
        required: schema.required.concat(this.props.form.fields_schema.required),
      };
    }

    return this.props.form.fields_schema;
  },

  getType() {
    return transform(this.getSchema());
  },

  getFields() {
    const schema = this.getSchema();
    const errors = ((this.props.errors || {}).updateUser || {}).errors || {};

    return _.reduce(schema.properties, function(memo, value, key) {
      let label = value.title;
      const isRequired = _.include(schema.required, key);
      if (isRequired) { label += ' *'; }

      const help = value.help || getHelpMessage(value);

      const field = {
        label,
        help,
        hasError: !!errors[key],
      };

      if (value.type === 'string') {
        field.type = value.format === 'uri' ? 'url' : (value.format || 'text');
      }

      memo[key] = field;

      return memo;
    }, {});
  },

  handleSubmit(value) {
    this.getAsyncAction('updateUser')(value);
  },

  render() {
    let button = '';
    let disabled = false;

    if (this.props.formIsSubmitted || !this.props.hasForm) {
      button = <span><Icon name="valid" colorize/>{translate('edit profile button text')}</span>;
    } else {
      button = translate('edit profile button text when profile incomplete');
    }

    if (this.state.updateUserState === 'pending') {
      button = translate('edit profile button text when attempting edit');
      disabled = true;
    }

    return (
      <Form type={this.getType()}
        fields={this.getFields()}
        value={this.props.profileData}
        submitMessage={button}
        onSubmit={this.handleSubmit}
        disabled={disabled}
        autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically} />
    );
  },
});
