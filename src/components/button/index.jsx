import React from 'react';
import { getStyles } from './styles';
import { StyleResolverMixin, BrowserStateMixin } from 'radium';

export default React.createClass({
  displayName: 'Button',

  propTypes: {
    icon: React.PropTypes.element,
    children: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.array,
    ]),
  },

  mixins: [StyleResolverMixin, BrowserStateMixin],

  render() {
    const styles = getStyles();
    const s = this.buildStyles(styles.button);
    return (
      <button {...this.getBrowserStateEvents()} {...this.props} style={s}>{this.props.icon}{this.props.children}</button>
    );
  },
});

