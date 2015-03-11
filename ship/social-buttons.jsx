var React = require('react');
var style = require('./style.scss');
var constants = require('./constants');

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    providers: React.PropTypes.array.isRequired,
    isWorking: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.string]),
    isLogingIn: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.string]),
    isLinking: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.string]),
    isUnlinking: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.string]),
    onLogIn: React.PropTypes.func.isRequired,
    onLinkIdentity: React.PropTypes.func.isRequired,
    onUnlinkIdentity: React.PropTypes.func.isRequired,
    translate: React.PropTypes.func.isRequired
  },

  renderButton: function(provider) {
    var actionName;
    var status;
    var t;

    if (this.props.user == null) {
      actionName = 'onLogIn';
      status = 'isLogingIn';
      t = ['log_in', 'is_loging_in'];
    } else if (provider.isLinked && provider.isUnlinkable) {
      actionName = 'onUnlinkIdentity';
      status = 'isUnlinking';
      t = ['unlink', 'is_unlinking'];
    } else if (!provider.isLinked) {
      actionName = 'onLinkIdentity';
      status = 'isLinking';
      t = ['link', 'is_linking'];
    } else {
      return;
    }

    var buttonClasses = 'hull-btn hull-btn-' + provider.name;
    var iconClasses = 'hull-icon hull-icon-' + provider.name;

    var m = this.props[status] === provider.name ? t[1] : t[0];
    var wording = this.props.translate(m, { provider: provider.name });

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

