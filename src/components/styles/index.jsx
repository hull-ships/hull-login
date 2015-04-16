'use strict';

import React from 'react';
import { Style } from 'radium';
import styles from '../../styles';

export default React.createClass({
  displayName: 'Styles',

  propTypes: {
    scope: React.PropTypes.string.isRequired
  },

  getSelector() {
    return `.${this.props.scope}.${this.props.scope}`;
  },

  getRules() {
    return [
      { '*': styles.reset },

      { 'a': styles.link },
      { 'a:active': styles.link },
      { 'a:hover': styles.link },
      { 'a:link': styles.link },
      { 'a:visited': styles.link },

      { '::-moz-placeholder': styles.placeholder },
      { ':-ms-input-placeholder': styles.placeholder },
      { '::-webkit-input-placeholder': styles.placeholder }
    ];
  },

  render() {
    return <Style scopeSelector={this.getSelector()} rules={this.getRules()} />;
  }
});

