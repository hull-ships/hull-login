import React from 'react';
import { translate } from '../../lib/i18n';
import Button from '../button';
import Help from '../help';
import TranslatedMessage from '../translated-message';
import { hasTranslation } from '../../lib/i18n';
import { getStyles } from './styles';

export default function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export default React.createClass({

  getErrorMessage() {
    let error = this.props.errors.signUp || this.props.errors.logIn;
    if (error && error.provider && error.provider !== 'classic') {
      let { reason, message } = error;
      let errorMessage;
      if (reason) {
        let msg = 'social-login error ' + reason;
        if (hasTranslation(msg)) {
          errorMessage = <TranslatedMessage message={msg} variables={error} />;
        } else {
          errorMessage = message || reason;
        }
      } else {
        errorMessage = message;
      }
      return errorMessage;
    }
  },

  renderButton(provider, index) {
    let actionName;
    let status;
    let button;
    let help;
    if (!this.props.user) {
      actionName = 'logIn';
      status = 'isLoggingIn';
      if (this.props.activeSection === 'signUp') {
        button = ['sign-up social button text', 'sign-up social button text when attempting sign-up'];
        help = 'sign-up help text';
      } else {
        button = ['log-in social button text', 'log-in social button text when attempting login'];
        help = 'log-in help text';
      }
    } else if (provider.isLinked && provider.isUnlinkable) {
      actionName = 'unlinkIdentity';
      status = 'isUnlinking';
      help = 'unlinking help text';
      button = ['Unlink your {provider} account', 'Unlinking {provider} account'];
    } else if (!provider.isLinked) {
      actionName = 'linkIdentity';
      status = 'isLinking';
      help = 'linking help text';
      button = ['Link your {provider} account', 'Linking {provider} account'];
    } else {
      return null;
    }

    let m = this.props[status] === provider.name ? button[1] : button[0];
    let providerName = capitalize(provider.name);
    let wording = translate(m, { provider: providerName });
    let helpText = <TranslatedMessage message={help + ' for ' + providerName} />;
    let handler = this.props[actionName].bind(null, provider.name);
    let isLast = this.props.providers.length === index + 1;
    let s = isLast ? {} : { marginBottom: 10 };

    return (
      <span key={provider.name}>
        <Button kind={provider.name} block={true} disabled={this.props.isWorking} onClick={handler}>
          {wording}
        </Button>
        <Help style={s}>
          {helpText}
        </Help>
      </span>
    );
  },

  renderErrors() {
    let styles = getStyles();
    let errorMessage = this.getErrorMessage();
    if (errorMessage) {
      return <div style={styles.socialLoginErrors}>{errorMessage}</div>;
    }
  },

  render: function() {
    let { providers } = this.props;
    let buttons = providers && providers.map(this.renderButton, this);
    return (
      <div>
        {this.renderErrors()}
        {buttons}
      </div>
    );
  }
});

