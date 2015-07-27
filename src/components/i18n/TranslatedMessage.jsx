'use strict';

import React from 'react';
import assign from 'object-assign';
import { translate } from '../../lib/i18n';

// Inspired by/modified version of
// https://github.com/yahoo/react-intl/blob/master/src/components/html-message.js
export default React.createClass({
  displayName: 'TranslatedMessage',

  propTypes: {
    message: React.PropTypes.string.isRequired,
    variables: React.PropTypes.object,
    tag: React.PropTypes.string,
    allowHTML: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      variables: {},
      tag: 'span',
      allowHTML: false // TODO read from settings
    };
  },

  render() {
    let rtn;
    if (this.props.allowHTML) {
      // TODO splat props
      rtn = React.createElement(this.props.tag, {
        dangerouslySetInnerHTML: {
          __html: translate(this.props.message, this.props.variables) // TODO DOMPurify
        }
      });
    } else {
      let props = assign({ 'class': this.props.className }, this.props);
      rtn = React.createElement(this.props.tag, props, translate(this.props.message, this.props.variables));
    }

    return rtn;
  }
});
