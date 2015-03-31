import cx from 'react/lib/cx';
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
    var showLabels = this.props.shipSettings.appearance.show_labels;
    var socialOnly = this.props.shipSettings.appearance.social_only;
    var providerLength = this.props.providers.length;
    var wording = showLabels ? translate(m, { provider: providerName }) : null;

    var handler = this.props[actionName].bind(null, provider.name);
    var divClassName = {
      'medium-6':(providerLength>3 && showLabels),
      'columns':true,
      'small-4':showLabels,
      'small-3':(!showLabels && !socialOnly)
    }
    return (
      <li key={[provider.name, actionName].join('-')} className={cx(divClassName)}>
        <button className={buttonClasses} disabled={this.props.isWorking} onClick={handler}>
          <Icon name={provider.name} settings={this.props.settings} color='#FFFFFF' /> &nbsp;&nbsp; <strong>{wording}</strong>
        </button>
      </li>
    );
  },

  render: function() {
    var containerClassName = {
      [`medium-block-grid-${this.props.providers.length}`]:(!this.props.shipSettings.appearance.show_labels && this.props.shipSettings.appearance.social_only),
      'row':true
    }
    return <ul className={cx(containerClassName)}>{this.props.providers.map(this.renderButton, this)}</ul>;
  }
});

