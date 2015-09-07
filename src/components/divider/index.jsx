import React from 'react';
import { getStyles } from './styles';

export default React.createClass({
  displayName: 'Divider',

  componentDidMount() {
    // React does not support the `align` attribute. Firefox needs it to center
    // the `<legend />` inside the `<fieldset />`.
    this.refs.content.getDOMNode().setAttribute('align', 'center');
  },

  render() {
    const styles = getStyles();

    return (
      <fieldset style={styles.divider}>
        <legend ref='content' style={styles.dividerContent}>{this.props.children}</legend>
      </fieldset>
    );
  }
});
