'use strict';

import Bounce from 'bounce';
import React from 'react';
import assign from 'object-assign';
import { getSettings } from '../../styles/settings';

let mediaQuery = window.matchMedia('(min-width: 460px)');

function getViewport() {
  return mediaQuery.matches ? 'normal' : 'compact';
}

const FOCUSABLE_ELEMENTS_SELECTOR = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex]:not([tabindex="-1"]), *[contenteditable]';

export default React.createClass({
  displayName: 'Overlay',

  propTypes: {
    className: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    visible: React.PropTypes.bool.isRequired,

    onClose: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { viewport: getViewport() };
  },

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown, true);
    mediaQuery.addListener(this.handleMediaQueryChange);

    React.findDOMNode(this.refs.overlay).focus();
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown, true);
    mediaQuery.removeListener(this.handleMediaQueryChange);
  },

  componentDidUpdate() {
    React.findDOMNode(this.refs.overlay).focus();
  },

  componentWillEnter(done) {
    let b = React.findDOMNode(this.refs.background);
    b.style.opacity = '0';
    /*eslint-disable */
    window.getComputedStyle(b).opacity; // Force browser write of opacity state.
    /*eslint-enable */
    b.style.opacity = '1';

    let overlay = React.findDOMNode(this.refs.overlay);

    let enterTransition = new Bounce();
    enterTransition.scale({
      from: { x: 0.8, y: 0.8 },
      to: { x: 1, y: 1 },
      bounces: 3,
      duration: 200,
      stiffness: 1
    });

    enterTransition.applyTo(overlay, {
      onComplete: function() {
        enterTransition.remove();
        done();
      }
    });
  },

  componentWillLeave(done) {
    let b = React.findDOMNode(this.refs.background);
    b.style.opacity = '1';
    /*eslint-disable */
    window.getComputedStyle(b).opacity; // Force browser write of opacity state.
    /*eslint-enable */
    b.style.opacity = '0';

    let overlay = React.findDOMNode(this.refs.overlay);
    overlay.style.opacity = '0';

    let exitTransition = new Bounce();
    exitTransition.scale({
      from: { x: 1, y: 1 },
      to: { x: 0.9, y: 0.9 },
      bounces: 1,
      duration: 500
    });

    exitTransition.applyTo(overlay, {
      onComplete: function() {
        exitTransition.remove();
        done();
      }
    });
  },

  handleMediaQueryChange() {
    this.setState({ viewport: getViewport() });
  },

  handleClose(e) {
    e.preventDefault();

    this.props.onClose();
  },

  handleKeydown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) { this.props.onClose(); }

    if (e.key === 'Tab' || e.keyCode === 9) {
      let focussed = e.target;
      let focusableElements = React.findDOMNode(this.refs.overlay).querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);

      let focussedIndex = -1;
      for (let i = 0, l = focusableElements.length; i < l; i++) {
        if (focusableElements[i] === focussed) {
          focussedIndex = i;
          break;
        }
      }

      if (e.shiftKey) {
        if (focussedIndex === 0) {
          e.preventDefault();
          focusableElements[focusableElements.length - 1].focus();
        }
      } else {
        if (focussedIndex === focusableElements.length - 1) {
          e.preventDefault();
          focusableElements[0].focus();
        }
      }
    }
  },

  getStyles() {
    const settings = getSettings();

    let overlayContainer = {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      display: (this.props.visible) ? 'block' : 'none'
    };

    let overlayBackground = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      zIndex: 20000,
      backgroundColor: 'rgba(0,0,0,.15)',
      opacity: 0,
      WebkitTransition: 'opacity 150ms ease-out',
      MsTransition: 'opacity 150ms ease-out',
      MozTransition: 'opacity 150ms ease-out',
      transition: 'opacity 150ms ease-out',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      userSelect: 'none'
    };

    let overlay = {
      backgroundColor: settings.whiteColor,
      padding: 30,
      zIndex: 20001,
      outline: 'none',
      position: 'relative',
      WebkitTransition: 'opacity 300ms ease-out',
      msTransition: 'opacity 300ms ease-out',
      MozTransition: 'opacity 300ms ease-out',
      transition: 'opacity 300ms ease-out',
      maxHeight: '100vh',
      overflow: 'scroll'
    };

    if (this.state.viewport === 'normal') {
      assign(overlayBackground, {
        position: 'fixed',
        overflowX: 'hidden',
        overflowY: 'auto'
      });

      assign(overlay, {
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.15)',
        borderRadius: settings.mediumBorderRadius,
        width: 340,
        margin: '50px auto'
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
      right: 15
    };

    return {
      overlayContainer,
      overlayBackground,
      overlay,
      overlayCloseButton
    };
  },

  render() {
    let styles = this.getStyles();
    let className = this.props.className + ' hull-login__modal';

    return (
      <div className={className} style={styles.overlayContainer}>
        <div
          className='hull-login__modal__dialog'
          aria-hidden={!this.props.visible}
          aria-label={this.props.title}
          role='dialog'
          style={styles.overlay}
          tabIndex={0}
          ref='overlay'>

          <a className='hull-login__modal_close-button' style={styles.overlayCloseButton} href='javascript: void 0;' aria-label='Close' title='Close this dialog' onClick={this.handleClose} >×</a>

          {this.props.children}
        </div>
        <div ref='background' className='hull-login__modal__overlay' style={styles.overlayBackground} onClick={this.handleClose} />
      </div>
    );
  }
});

