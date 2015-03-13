import React from 'react';
import { translate } from './i18n';

export default React.createClass({
  renderButton: function(provider) {
    var actionName;
    var status;
    var t;

    if (this.props.user == null) {
      actionName = 'logIn';
      status = 'isLogingIn';
      if (this.props.activeSection === 'signUp') {
        t = ['Sign up with {provider}', 'Signing up with {provider}']
      } else {
        t = ['Log in with {provider}', 'Logging in with {provider}'];
      }
    } else if (provider.isLinked && provider.isUnlinkable) {
      actionName = 'unlinkIdentity';
      status = 'isUnlinking';
      t = ['Unlink your {provider} account', 'Unlinking {provider} account'];
    } else if (!provider.isLinked) {
      actionName = 'linkIdentity';
      status = 'isLinking';
      t = ['Link your {provider} account', 'Linking {provider} account'];
    } else {
      return;
    }

    var buttonClasses = 'hull-btn hull-btn-' + provider.name;
    var iconClasses = 'hull-icon hull-icon-' + provider.name;

    var m = this.props[status] === provider.name ? t[1] : t[0];
    var wording = translate(m, { provider: provider.name });

    var handler = this.props[actionName].bind(null, provider.name);
    return (
      <button key={[provider.name, actionName].join('-')} className={buttonClasses} disabled={this.props.isWorking} onClick={handler}>
        <i className={iconClasses}></i> {wording}
      </button>
    );
  },

  render: function() {
    return (
      <div className='hull-buttons'>
        {this.props.providers.map(this.renderButton, this)}
      </div>
    );
  }
});

