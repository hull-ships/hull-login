import React from 'react';
import LayeredComponentMixin from 'react-components/layered-component-mixin';
import style from './style.scss';
import LogInSection from './log-in-section.jsx';
import SignUpSection from './sign-up-section.jsx';
import ResetPasswordSection from './reset-password-section.jsx';
import ShowProfileSection from './show-profile-section.jsx';
import EditProfileSection from './edit-profile-section.jsx';
import { translate } from './i18n';

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
      <div className='dialog-container'>
        <div className='dialog'>
          <a href='#' onClick={this.props.actions.hideDialog}>{translate('close')}</a>

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
    var m = this.state.user ? 'Show profile' : 'Log in';

    return <a href='#' onClick={this.props.actions.showDialog}>{translate(m)}</a>;
  }
});

