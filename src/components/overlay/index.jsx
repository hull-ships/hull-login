import Bounce from 'bounce';
import React from 'react';
import cssModules from 'react-css-modules';
import styles from './overlay.css';

const mediaQuery = window.matchMedia && window.matchMedia('(min-width: 460px)');

function getViewport() {
  return (!mediaQuery || mediaQuery.matches) ? 'normal' : 'compact';
}

const FOCUSABLE_ELEMENTS_SELECTOR = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex]:not([tabindex="-1"]), *[contenteditable]';

const Overlay = React.createClass({
  displayName: 'Overlay',

  propTypes: {
    title: React.PropTypes.string.isRequired,
    visible: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func.isRequired,
    children: React.PropTypes.any,
  },

  getInitialState() {
    return { viewport: getViewport() };
  },

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown, true);
    if (!!mediaQuery) {
      mediaQuery.addListener(this.handleMediaQueryChange);
    }

    this.refs.overlay.focus();
  },

  componentDidUpdate() {
    this.refs.overlay.focus();
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown, true);
    if (!!mediaQuery) {
      mediaQuery.removeListener(this.handleMediaQueryChange);
    }
  },

  componentWillEnter(done) {
    const b = this.refs.background;
    b.style.opacity = '0';
    /*eslint-disable */
    window.getComputedStyle(b).opacity; // Force browser write of opacity state.
    /*eslint-enable */
    b.style.opacity = '1';

    const overlay = this.refs.overlay;

    const enterTransition = new Bounce();
    enterTransition.scale({
      from: { x: 0.9, y: 0.9 },
      to: { x: 1, y: 1 },
      bounces: 1,
      duration: 400,
    });

    enterTransition.applyTo(overlay, {
      onComplete: function() {
        enterTransition.remove();
        done();
      },
    });
  },

  componentWillLeave(done) {
    const b = this.refs.background;
    b.style.opacity = '1';
    /*eslint-disable */
    window.getComputedStyle(b).opacity; // Force browser write of opacity state.
    /*eslint-enable */
    b.style.opacity = '0';

    const overlay = this.refs.overlay;
    overlay.style.opacity = '0';

    const exitTransition = new Bounce();
    exitTransition.scale({
      from: { x: 1, y: 1 },
      to: { x: 0.9, y: 0.9 },
      bounces: 1,
      duration: 400,
    });

    exitTransition.applyTo(overlay, {
      onComplete: function() {
        exitTransition.remove();
        done();
      },
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
      const focussed = e.target;
      const focusableElements = this.refs.overlay.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);

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


  render() {
    return (
      <div styleName="container">
        <div aria-hidden={!this.props.visible}
          aria-label={this.props.title}
          role="dialog"
          styleName="overlay"
          tabIndex={0}
          ref="overlay">

          <a styleName="close-button"
            href="#"
            aria-label="Close"
            title="Close this dialog"
            onClick={this.handleClose} >×</a>

          {this.props.children}
        </div>
        <div ref="background" styleName="background" onClick={this.handleClose} />
      </div>
    );
  },
});

export default cssModules(Overlay, styles);
