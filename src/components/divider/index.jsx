import React from 'react';
import cssModules from 'react-css-modules';
import styles from './divider.css';

const Divider = React.createClass({

  propTypes: {
    children: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.array,
      React.PropTypes.string
    ]).isRequired
  },

  componentDidMount() {
    // React does not support the `align` attribute. Firefox needs it to center
    // the `<legend />` inside the `<fieldset />`.
    return this.refs.content && this.refs.content.setAttribute('align', 'center');
  },

  render() {
    return (
      <fieldset styleName="divider">
        <legend ref="content" styleName="content">{this.props.children}</legend>
      </fieldset>
    );
  }
});

export default cssModules(Divider, styles);

