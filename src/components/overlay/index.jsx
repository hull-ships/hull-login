'use strict';

import React from 'react';
import assign from 'object-assign';
import color from 'color';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';
import { getSettings } from '../../styles/settings';

let mediaQuery = window.matchMedia('(min-width: 460px)');

function getViewport() {
  return mediaQuery.matches ? 'normal' : 'compact';
}

export default React.createClass({
  displayName: 'Overlay',

  mixins: [
    StyleResolverMixin,
    BrowserStateMixin
  ],

  propTypes: {
    className: React.PropTypes.string,
    onClose: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { viewport: getViewport() }
  },

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown, true);
    mediaQuery.addListener(this.handleMediaQueryChange);
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown, true);
    mediaQuery.removeListener(this.handleMediaQueryChange);
  },

  componentDidEnter() {
    // TODO Animate
  },

  componentDidLeave() {
    // TODO Animate
  },

  handleMediaQueryChange() {
    this.setState({ viewport: getViewport() });
  },

  handleClick(e) {
    e.preventDefault();

    this.props.onClose();
  },

  handleKeydown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) { this.props.onClose(); }
  },

  getStyles() {
    const settings = getSettings();

    let overlayBackground = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      zIndex: 20000,
      backgroundColor: 'rgba(0,0,0,.15)'
    };

    let overlay = {
      backgroundColor: settings.whiteColor,
      padding: 30,
      position: 'relative'
    };

    if (this.state.viewport === 'normal') {
      assign(overlayBackground, {
        position: 'fixed',
        overflowX: 'hidden',
        overflowY: 'auto',
      });

      assign(overlay, {
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.15)',
        borderRadius: settings.mediumBorderRadius,
        width: 340,
        margin: '50px auto',
      });
    }

    const overlayCloseButton = {
      position: 'absolute',
      textAlign: 'center',
      width: 20,
      height: 20,
      fontSize: 20,
      lineHeight: '18px',
      textDecoration: 'none',
      top: 15,
      right: 15,
      color: settings.grayColor,

      states: [
        {
          hover: {
            color: color(settings.grayColor).darken(.2).hexString()
          }
        },
        {
          active: {
            color: color(settings.grayColor).darken(.4).hexString()
          }
        }
      ]
    };

    return {
      overlayBackground,
      overlay,
      overlayCloseButton
    }
  },

  render() {
    const styles = this.getStyles();

    return (
      <div style={styles.overlayBackground} className={this.props.className}>
        <div style={styles.overlay} tabIndex='-1'>
          <a {...this.getBrowserStateEvents()} style={this.buildStyles(styles.overlayCloseButton)} href='javascript: void 0;' onClick={this.handleClick}>×</a>
          {this.props.children}
        </div>
      </div>
    );
  }
});

