var React = require('react');
var style = require('./style.scss');
var constants = require('./constants');

module.exports = React.createClass({
  getInitialState: function() {
    return this.props.engine.getState();
  },

  componentWillMount: function() {
    style.use();
    this.props.engine.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    style.unuse();
    this.props.engine.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(this.props.engine.getState());
  },

  translate: function(message, data) {
    return this.props.engine.translate(message, data);
  },

  handleAction: function(actionName, providerName, e) {
    e.preventDefault();

    var actions = this.props.engine.getActions();
    actions[actionName](providerName);
  },

  handleLogOut: function(e) {
    e.preventDefault();

    var actions = this.props.engine.getActions();
    actions.logout();
  },

  renderError: function() {
    if (this.state.error == null) { return; }

    var wording = this.translate(this.state.error.reason + '_error', this.state.error) || this.translate('unknown_error', this.state.error);

    var error = React.DOM.p({
      className: 'hull-error',
      dangerouslySetInnerHTML: {
        __html: wording
      }
    });

    return (
      <div className='hull-error-container'>{error}</div>
    );
  },

  renderLogOut: function() {
    if (this.state.user == null) { return; }

    var wording = this.translate('logout');

    return (
      <a href='#' onClick={this.handleLogOut}>{wording}</a>
    );
  },

  renderButtons: function() {
    return (
      <div className='hull-social-container'>
        {this.state.providers.map(this.renderButton, this)}
      </div>
    );
  },

  renderButton: function(provider) {
    var actionName;

    if (this.state.user == null) {
      actionName = 'login';
    } else if (provider.isLinked && provider.isUnlinkable) {
      actionName = 'unlinkIdentity';
    } else if (!provider.isLinked) {
      actionName = 'linkIdentity';
    } else {
      return;
    }

    var buttonClasses = 'hull-btn hull-btn-' + provider.name;
    var iconClasses = 'hull-icon hull-icon-' + provider.name;

    var m = this.state[constants.STATUS[actionName]] === provider.name ? constants.STATUS[actionName] : actionName;
    var wording = this.translate(m, { provider: provider.name });

    return (
      <button key={[provider.name, actionName].join('-')} className={buttonClasses} disabled={this.state.isWorking} onClick={this.handleAction.bind(this, actionName, provider.name)}>
        <i className={iconClasses}></i> {wording}
      </button>
    );
  },

  render: function() {
    return (
      <div className='hull-social'>
        {this.renderError()}
        {this.renderLogOut()}
        {this.renderButtons()}
      </div>
    );
  }
});

