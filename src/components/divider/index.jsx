'use strict';

import React from 'react';
import { getStyles } from './styles';

export default React.createClass({
  displayName: 'Divider',

  render() {
    const styles = getStyles();

    return (
      <fieldset style={styles.divider}>
        <legend align='center' style={styles.dividerContent}>{this.props.children}</legend>
      </fieldset>
    );
  }
});

