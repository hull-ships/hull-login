import React from 'react';
import Icon from './icon';
import capitalize from '../lib/capitalize';
import { translate } from '../lib/i18n';

export default React.createClass({
  renderButton: function(provider) {
    var actionName;
    var status;
    var t;
    if (this.props.user == null) {
      actionName = 'logIn';
      status = 'isLogingIn';
      if (this.props.activeSection === 'signUp') {
        t = ['{provider}', 'Signing up with {provider}']
      } else {
        t = ['{provider}', 'Logging in with {provider}'];
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

    var buttonClasses = 'radius expand columms tiny button bc-social bc-background-' + provider.name;
    var iconClasses = 'icon icon-' + provider.name;

    var m = this.props[status] === provider.name ? t[1] : t[0];
    var providerName = capitalize(provider.name)
    var wording = translate(m, { provider: providerName });

    var handler = this.props[actionName].bind(null, provider.name);
    return (
      <div key={[provider.name, actionName].join('-')} className="small-6 columns">
        <button className={buttonClasses} disabled={this.props.isWorking} onClick={handler}>
          <Icon name={provider.name} settings={this.props.settings} color='#FFFFFF' /> &nbsp;&nbsp; <strong>{wording}</strong>
        </button>
      </div>
    );
  },

  render: function() {
    return (
      <div className={`even-${this.props.providers.length} small-block-grid-2`}>
        {this.props.providers.map(this.renderButton, this)}
      </div>
    );
  }
});

