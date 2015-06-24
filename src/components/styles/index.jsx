'use strict';

import React from 'react';
import { Style } from 'radium';
import { getStyles } from '../../styles';

const s = { border: 0, padding: 0 };

export default React.createClass({
  displayName: 'Styles',

  propTypes: {
    scope: React.PropTypes.string.isRequired
  },

  getSelector() {
    return `.${this.props.scope}.${this.props.scope}`;
  },

  getRules() {
    const styles = getStyles();

    let rules = [
      { 'a': styles.link },
      { 'a:active': styles.link },
      { 'a:link': styles.link },
      { 'a:visited': styles.link },
      { 'a:hover': styles.linkHover },
      { 'a:focus': styles.linkFocus },

      { '::-moz-placeholder': styles.placeholder },
      { ':-ms-input-placeholder': styles.placeholder },
      { '::-webkit-input-placeholder': styles.placeholder },

      { '::-moz-focus-inner': s }
    ];

    if (this.props.reset) {
      rules.unshift({ '*': styles.reset });
    }

    return rules;
  },

  render() {
    return <Style scopeSelector={this.getSelector()} rules={this.getRules()} />;
  }
});

