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
      allowHTML: true // TODO read from settings
    };
  },

  render() {
    const translation = translate(this.props.message, this.props.variables);

    if (!translation) {
      return null;
    }

    let rtn;
    if (this.props.allowHTML) {
      let props = assign({
        'class': this.props.className,
        dangerouslySetInnerHTML: {
          __html: translation // TODO DOMPurify
        }
      }, this.props);
      rtn = React.createElement(this.props.tag, props);
    } else {
      let props = assign({ 'class': this.props.className }, this.props);
      rtn = React.createElement(this.props.tag, props, translation);
    }

    return rtn;
  }
});
