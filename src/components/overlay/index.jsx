// import Bounce from 'bounce';
import React from 'react';
import cssModules from 'react-css-modules';
import styles from './overlay.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const FOCUSABLE_ELEMENTS_SELECTOR = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex]:not([tabindex="-1"]), *[contenteditable]';

const Overlay = React.createClass({
  displayName: 'Overlay',

  propTypes: {
    title: React.PropTypes.string.isRequired,
    styles: React.PropTypes.object,
    hasErrors: React.PropTypes.bool.isRequired,
    visible: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func.isRequired,
    children: React.PropTypes.any,
  },

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown, true);
    this.setFocus();
  },

  componentDidUpdate() {
    this.setFocus();
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown, true);
  },

  setFocus() {
    if (this.refs.modal) {
      this.refs.modal.focus();
    }
  },

  handleClose(e) {
    e.preventDefault();
    this.props.onClose();
  },

  handleModalClick(e) {
    e.stopPropagation();
  },

  handleKeydown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) { this.props.onClose(); }

    if (e.key === 'Tab' || e.keyCode === 9) {
      const focussed = e.target;
      const focusableElements = this.refs.modal.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);

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
  renderContent() {
    if (!this.props.visible) {return null;}
    const modalClass = this.props.hasErrors ? 'modal-shake' : 'modal';
    return (
      <div
        onClick={this.handleClose}
        styleName="wrapper"
        key="wrapper"
        ref="wrapper"
      >
        <div aria-hidden={!this.props.visible}
          aria-label={this.props.title}
          role="dialog"
          key="modal"
          ref="modal"
          styleName={modalClass}
          tabIndex={0}
          onClick={this.handleModalClick}>

          <a styleName="close-button" href="#" aria-label="Close" title="Close this dialog" onClick={this.handleClose} />
          {this.props.children}
        </div>
      </div>
    );
  },
  renderBackground() {
    if (!this.props.visible) { return null; }
    return <div key="background" ref="background" styleName="background" onClick={this.handleClose} />;
  },

  render() {
    const { enter, enterActive, leave, leaveActive, appear, appearActive } = this.props.styles;
    return (
      <div className="meta">
        <ReactCSSTransitionGroup
            component="div"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
            transitionName={{ enter, enterActive, leave, leaveActive, appear, appearActive }}
        >{this.renderContent()}{this.renderBackground()}</ReactCSSTransitionGroup>
      </div>
    );
  },
});

export default cssModules(Overlay, styles);
