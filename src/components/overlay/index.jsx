'use strict';

import React from 'react';
import { getStyles } from './styles';

export default React.createClass({
  displayName: 'Overlay',

  propTypes: {
    className: React.PropTypes.string,
    onClose: React.PropTypes.func.isRequired
  },

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown, true);
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown, true);
  },

  componentDidEnter() {
    // TODO Animate
  },

  componentDidLeave() {
    // TODO Animate
  },

  handleClick(e) {
    e.preventDefault();

    this.props.onClose();
  },

  handleKeydown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) { this.props.onClose(); }
  },

  render() {
    const styles = getStyles();

    return (
      <div style={styles.overlayBackground} className={this.props.className}>
        <div style={styles.overlay} tabIndex='-1'>
          <a style={styles.overlayCloseButton} href='javascript: void 0;' onClick={this.handleClick}>×</a>
          {this.props.children}
        </div>
      </div>
    );
  }
});

