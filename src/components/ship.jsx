import React from 'react';
import LayeredComponentMixin from 'react-components/layered-component-mixin';
import style from '../styles/style.scss';
import LogInSection from './log-in-section';
import SignUpSection from './sign-up-section';
import ResetPasswordSection from './reset-password-section';
import ShowProfileSection from './show-profile-section';
import EditProfileSection from './edit-profile-section';
import { translate } from '../lib/i18n';

const SECTIONS = {
  logIn: LogInSection,
  signUp: SignUpSection,
  resetPassword: ResetPasswordSection,
  showProfile: ShowProfileSection,
  editProfile: EditProfileSection
};

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

  renderDialog: function() {
    var Section = SECTIONS[this.state.activeSection];
    return (
      <div className="reveal-modal-container open">
        <div className="reveal-modal-bg">
        </div>
        <div className="reveal-modal">
          <a href='#' className='close-reveal-modal' onClick={this.props.actions.hideDialog}>×</a>
          <Section {...this.state} {...this.props.actions} />
        </div>
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
    if(this.state.dialogIsVisible){
      return <span></span>;
    }
    if(this.state.user){
      var logout = <a href='#' className='tiny button radius' onClick={this.props.actions.logOut}><strong>{translate('log_out')}</strong></a>
    }
    var m = this.state.user ? 'Show Profile' : 'Login';
    return <div>
      <a href='#' className='tiny button radius' onClick={this.props.actions.showDialog}><strong>{translate(m)}</strong></a>
      &nbsp;
      {logout}
    </div>
  }
});

