import React from 'react';
import t from 'tcomb-form';
import { getStyles } from './styles';
import { Form, OrganizationImage, TranslatedMessage } from '../components';
import { Mixins, I18n, FieldTypes } from '../lib';

let { translate } = I18n;
let { Email } = FieldTypes;

export default React.createClass({
  displayName: 'ResetPasswordSection',

  mixins: [
    Mixins.AsyncActions
  ],

  getAsyncActions() {
    return {
      resetPassword: this.props.resetPassword
    };
  },

  getInitialState() {
    return { displayErrors: false };
  },

  getType() {
    return t.struct({
      email: Email
    });
  },

  getFields() {
    let hasError = this.state.displayErrors && this.props.errors.resetPassword != null;
    let errorMessage = this.props.errors.resetPassword && this.props.errors.resetPassword.message;

    let help;
    if (this.state.resetPasswordState === 'done') {
      help = <TranslatedMessage message='reset password message when completed reset' />;
    } else if (this.state.resetPasswordError) {
      help = <TranslatedMessage message={errorMessage} />;
    }

    return {
      email: {
        placeholder: translate('reset password email placeholder'),
        type: 'email',
        hasError,
        error: hasError && <TranslatedMessage message={errorMessage} />,
        help,
        autoFocus: true
      }
    };
  },

  handleSubmit(value) {
    this.getAsyncAction('resetPassword')(value.email);
  },

  handleChange(changes) {
    let { email } = changes.value;
    if (email) {
      this.props.updateCurrentEmail(email);
    }
    this.setState({ displayErrors: false });
  },

  render() {
    let m;
    let d;
    if (this.state.resetPasswordState === 'done') {
      m = translate('reset password button text when completed reset');
      d = true;
    } else if (this.state.resetPasswordState === 'pending') {
      m = translate('reset password button text when attempting reset');
      d = true;
    } else {
      m = translate('reset password button text');
      d = !!this.state.resetPasswordError;
    }

    const styles = getStyles();

    return (
      <div>
        <div style={styles.sectionHeader}>
          <OrganizationImage style={styles.sectionOrganizationImage} src={this.props.shipSettings.logo_image} />
          <TranslatedMessage tag='h1'
            style={styles.sectionTitle}
            message='reset password header' />
          <p style={styles.sectionText}>
            <TranslatedMessage tag='a'
              href='#'
              onClick={this.props.activateLogInSection}
              message='reset password switch to log-in link' />
          </p>
        </div>

        <Form kind='compact'
          type={this.getType()}
          value={{ email: this.props.currentEmail }}
          fields={this.getFields()}
          submitMessage={m}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          disabled={d}
          autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically} />
      </div>
    );
  }
});

