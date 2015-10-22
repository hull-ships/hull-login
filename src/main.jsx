import React from 'react';
import _ from 'lodash';
import cssModules from 'react-css-modules';
import styles from './main.css';
import Icon from './components/icon';
import { Mixins, I18n, Utils } from './lib';
import Sections from './sections';
import { Overlay, Styles, PageButtons } from './components';

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
    if (!!this.state.shipSettings.show_inline) { return null; }
    const visible = !!this.state.dialogIsVisible;
    const data = { organization: this.state.organization.name };
    const titles = {
      logIn: translate('log-in header', data),
      signUp: translate('sign-up header', data),
      resetPassword: translate('reset password header'),
      showProfile: translate('view profile header'),
      editProfile: translate('edit profile header'),
      thanks: translate('thanks header'),
    };

    const title = titles[this.state.activeSection];
    return (
      <Overlay
        onClose={this.props.actions.hideDialog}
        hasErrors={!!_.size(this.state.errors)}
        title={title}
        visible={visible}>
        {this.renderContent()}
      </Overlay>
    );
  },

  renderSpinner() {
    if (!this.state.isWorking) { return null; }
    return <div className={this.props.styles.spinner}><Icon name="spinner"/></div>;
  },

  renderContent() {
    const { shipSettings } = this.state;

    if (shipSettings.show_inline) {
      const Section = Sections[this.state.activeSection];
      return (
        <div className={this.props.styles.content}>
          {this.renderSpinner()}
          <Section {...this.state} {...this.props.actions} />
        </div>
      );
    } else if (shipSettings.show_signup || shipSettings.show_login || shipSettings.show_profile) {
      return <PageButtons {...this.state} actions={this.props.actions}/>;
    }
  },

  renderLayer() {
    return this.renderOverlay();
  },

  render() {
    const { shipSettings } = this.state;
    return (
      <div styleName="ship">
        <Styles scope={this.props.styles.ship} styles={this.props.styles} settings={shipSettings} />
        {this.renderUserStyles()}
        {this.renderContent()}
      </div>
    );
  },
});

export default cssModules(HullLogin, styles);
