import React from 'react';
import style from './style.scss';
import LayeredComponentMixin from 'react-components/layered-component-mixin';
import SocialButtons from './social-buttons.jsx'

export default React.createClass({
  mixins: [
    LayeredComponentMixin
  ],

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

  handleAction: function(actionName, providerName, e) {
    if (arguments.length <= 2) {
      e = providerName;
      providerName = null;
    }

    e.preventDefault();

    var actions = this.props.engine.getActions();
    actions[actionName](providerName);
  },

  handleLogOut: function(e) {
    this.handleAction('logout', e);
  },

  showDialog: function(e) {
    this.handleAction('showDialog', e);
  },

  hideDialog: function(e) {
    this.handleAction('hideDialog', e);
  },

  translate: function(message, data) {
    console.log('MESSAGE', message, data);
    return this.props.engine.translate(message, data);
  },

  renderDialog: function() {
    return (
      <div>
        <h1>Hey</h1>
        <a href='#' onClick={this.hideDialog}>Close</a>

        <SocialButtons
          user={this.state.user}
          providers={this.state.providers}
          isWorking={this.state.isWorking}
          isLogingIn={this.state.isLogingIn}
          isLinking={this.state.isLinking}
          isUnlinking={this.state.isUnlinking}
          onLogIn={this.handleAction.bind(this, 'login')}
          onLinkIdentity={this.handleAction.bind(this, 'linkIdentity')}
          onUnlinkIdentity={this.handleAction.bind(this, 'unlinkIdentity')}
          translate={this.translate} />
      </div>
    );
  },

  renderLayer: function() {
    if (this.state.dialogIsVisible) {
      return this.renderDialog();
    } else {
      // renderLayer does not know how to render `null`.
      return <noscript />;
    }
  },

  render: function() {
    console.log(this.state);
    if (this.state.user) {
      return <a href='#' onClick={this.handleLogOut}>Log out</a>;
    } else {
      return <a href='#' onClick={this.showDialog}>Log in</a>;
    }
  }
});

