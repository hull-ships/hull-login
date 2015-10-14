import React from 'react';
import cssModules from 'react-css-modules';
import classnames from 'classnames';
import styles from './button.css';

const Button = React.createClass({
  displayName: 'Button',

  propTypes: {
    icon: React.PropTypes.element,
    block: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    kind: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.array,
      React.PropTypes.string,
    ]).isRequired,
  },

  render() {
    const cn = classnames({
      button: true,
      block: this.props.block,
      disabled: this.props.disabled,
      [this.props.kind]: !!this.props.kind,
    });
    return (
      <button {...this.props} styleName={cn}>{this.props.icon}{this.props.children}</button>
    );
  },
});


export default cssModules(Button, styles, {allowMultiple: true});
