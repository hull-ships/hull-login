import React from 'react';
import { hasTranslation } from '../../lib/i18n';
import { getStyles } from './styles';
import TranslatedMessage from '../translated-message';


export default React.createClass({
  displayName: 'SocialLoginErrors',

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

  render() {
    let styles = getStyles();
    let errorMessage = this.getErrorMessage();
    let ret;
    if (errorMessage) {
      ret = <div style={styles.socialLoginErrors}>{errorMessage}</div>;
    } else {
      ret = <span />;
    }

    return ret;
  }
});
