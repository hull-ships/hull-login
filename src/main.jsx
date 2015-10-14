import React from 'react';
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup';
import { Mixins, I18n, Utils } from './lib';
import Sections from './sections';
import { Overlay, Styles, TranslatedMessage } from './components';

const { translate } = I18n;

export default React.createClass({
  displayName: 'HullLoginShip',

  propTypes: {
    engine: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
  },

  mixins: [Mixins.LayeredComponent],

  getInitialState() {
    return this.props.engine.getState();
  },

  componentWillMount() {
    this.preloadImages();
    this.props.engine.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    this.props.engine.removeChangeListener(this._onChange);
  },

  getScope() {
    return `ship-${this.state.ship.id}`;
  },

  getResetStyles() {
    return this.state.shipSettings && this.state.shipSettings.reset_styles;
  },

  callAction(action) {
    return (e)=> {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      const fn = this.props.actions[action];
      if (fn) {
        return fn.call(this);
      }
    };
  },

  preloadImages() {
    const ship = this.state.ship;
    if (ship && ship.manifest && ship.manifest.settings) {
      ship.manifest.settings.map((s)=> {
        if (s && s.format === 'image') {
          const imageUrl = this.state.shipSettings[s.name];
          if (imageUrl) {
            Utils.preloadImage(imageUrl);
          }
        }
      });
    }
  },

  _onChange() {
    this.setState(this.props.engine.getState());
  },

  renderUserStyles() {
    return !this.state.shipSettings.custom_styles ? null : <style dangerouslySetInnerHTML={{__html: this.state.shipSettings.custom_styles}}></style>;
  },

  renderOverlay() {
    if (!this.state.dialogIsVisible || !!this.state.shipSettings.show_inline) { return null; }

    const d = { organization: this.state.organization.name };
    const titles = {
      logIn: translate('log-in header', d),
      signUp: translate('sign-up header', d),
      resetPassword: translate('reset password header'),
      showProfile: translate('view profile header'),
      editProfile: translate('edit profile header'),
      thanks: translate('thanks header'),
    };

    const t = titles[this.state.activeSection];
    return (
      <Overlay className={this.getScope()} onClose={this.props.actions.hideDialog} title={t} visible>
        {this.renderContent()}
      </Overlay>
    );
  },

  renderContent() {
    const Section = Sections[this.state.activeSection];
    return (
      <div className={this.getScope()}>
        <Section {...this.state} {...this.props.actions} />
      </div>
    );
  },

  renderLayer() {
    return (
      <ReactTransitionGroup>{this.renderOverlay()}</ReactTransitionGroup>
    );
  },


  renderButtons() {
    const u = this.state.user;

    const buttons = [];
    if (u) {
      if (this.state.shipSettings.show_profile) {
        if (this.state.hasForm && !this.state.formIsSubmitted) {
          const b = (
            <TranslatedMessage tag="a"
              href="#"
              key="complete-profile"
              className="hull-login__button hull-login__button--edit-profile"
              onClick={this.callAction('activateEditProfileSection')}
              message="nav complete profile link" />
          );
          buttons.push(b);
        } else {
          const b = (
            <a href="#"
              key="show-profile"
              className="hull-login__button hull-login__button--show-profile"
              onClick={this.callAction('activateShowProfileSection')}>{u.name || u.username || u.email}</a>
          );
          buttons.push(b);
        }
      }

      if (this.state.shipSettings.custom_buttons.length) {
        for (let i = 0; i < this.state.shipSettings.custom_buttons.length; i++) {
          const { url, popup, text } = this.state.shipSettings.custom_buttons[i];
          const b = (
            <a href={url}
              key={`custom-action-${i}`}
              target={popup ? '_blank' : ''}
              className="hull-login__button hull-login__button">{text}</a>
          );
          buttons.push(b);
        }
      }

      const b = (
        <TranslatedMessage tag="a"
          href="#"
          className="hull-login__button hull-login__button--log-out"
          onClick={this.callAction('logOut')}
          message="nav logout link" />
      );
      buttons.push(b);
    } else {
      if (this.state.shipSettings.show_login) {
        const b = (
          <TranslatedMessage tag="a"
            href="#"
            key="log-in"
            className="hull-login__button hull-login__button--log-in"
            onClick={this.callAction('activateLogInSection')}
            message="nav login link" />
        );
        buttons.push(b);
      }

      if (this.state.shipSettings.show_signup) {
        const b = (
          <TranslatedMessage tag="a"
            href="#"
            key="sign-up"
            className="hull-login__button hull-login__button--sign-up"
            onClick={this.callAction('activateSignUpSection')}
            message="nav sign-up link" />
        );
        buttons.push(b);
      }
    }
    return buttons;
  },

  render() {
    return (
      <div className="hull-login">
        <Styles scope={this.getScope()} reset={this.getResetStyles()} />
        {this.renderUserStyles()}
        {this.state.shipSettings.show_inline ? this.renderContent() : this.renderButtons()}
      </div>
    );
  },
});
