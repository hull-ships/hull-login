'use strict';

import React from 'react';
import styles from './styles';

export default React.createClass({
  displayName: 'Divider',

  render() {
    return (
      <fieldset style={styles.divider}>
        <legend style={styles.dividerContent}>{this.props.children}</legend>
      </fieldset>
    );
  }
});

