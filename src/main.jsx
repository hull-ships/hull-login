import React from 'react';
import cssModules from 'react-css-modules';
import styles from './main.css';
import Icon from './components/icon';
import { Mixins, I18n, Utils } from './lib';
import Sections from './sections';
import { Overlay, Styles, TranslatedMessage } from './components';
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup';

const { translate } = I18n;

const HullLogin = React.createClass({
  displayName: 'HullLoginShip',

  propTypes: {
    engine: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
    styles: React.PropTypes.object,
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
      <Overlay styleName="modal" onClose={this.props.actions.hideDialog} title={t} visible>
        {this.renderContent()}
      </Overlay>
    );
  },

  renderSpinner() {
    if (!this.state.isWorking) { return null; }
    return <div className={this.props.styles.spinner}><Icon name="spinner"/></div>;
  },

  renderContent() {
    const Section = Sections[this.state.activeSection];
    return (
      <div className={this.props.styles.content}>
        {this.renderSpinner()}
        <Section {...this.state} {...this.props.actions} />
      </div>
    );
  },

  renderLayer() {
    return <ReactTransitionGroup>{this.renderOverlay()}</ReactTransitionGroup>;
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
              styleName="edit-profile"
              onClick={this.callAction('activateEditProfileSection')}
              message="nav complete profile link" />
          );
          buttons.push(b);
        } else {
          const b = (
            <a href="#"
              key="show-profile"
              styleName="show-profile"
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
              styleName="custom">{text}</a>
          );
          buttons.push(b);
        }
      }

      const b = (
        <TranslatedMessage tag="a"
          href="#"
          key="log-out"
          styleName="log-out"
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
            styleName="log-in"
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
            styleName="sign-up"
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
      <div styleName="ship">
        <Styles
          scope={this.props.styles.ship}
          styles={this.props.styles}
          settings={this.state.shipSettings} />
        {this.renderUserStyles()}
        {this.renderButtons()}
      </div>
    );
  },
});

export default cssModules(HullLogin, styles);
