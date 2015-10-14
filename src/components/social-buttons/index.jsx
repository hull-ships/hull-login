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

  propTypes: {
    errors: React.PropTypes.object,
    user: React.PropTypes.object,
    providers: React.PropTypes.array,
    activeSection: React.PropTypes.string,
    isWorking: React.PropTypes.bool,
  },

  getErrorMessage() {
    const error = this.props.errors.signUp || this.props.errors.logIn;
    if (error && error.provider && error.provider !== 'classic') {
      const { reason, message } = error;
      let errorMessage;
      if (reason) {
        const msg = 'social-login error ' + reason;
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

    const m = this.props[status] === provider.name ? button[1] : button[0];
    const providerName = capitalize(provider.name);
    const wording = translate(m, { provider: providerName });
    const helpText = <TranslatedMessage message={help + ' for ' + providerName} />;
    const handler = this.props[actionName].bind(null, provider.name);
    const isLast = this.props.providers.length === index + 1;
    const s = isLast ? {} : { marginBottom: 10 };

    return (
      <span key={provider.name}>
        <Button kind={provider.name} block disabled={this.props.isWorking} onClick={handler}>
          {wording}
        </Button>
        <Help style={s}>
          {helpText}
        </Help>
      </span>
    );
  },

  renderErrors() {
    const styles = getStyles();
    const errorMessage = this.getErrorMessage();
    if (errorMessage) {
      return <div style={styles.socialLoginErrors}>{errorMessage}</div>;
    }
  },

  render: function() {
    const { providers } = this.props;
    const buttons = providers && providers.map(this.renderButton, this);
    return (
      <div>
        {this.renderErrors()}
        {buttons}
      </div>
    );
  },
});

