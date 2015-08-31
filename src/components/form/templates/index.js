'use strict';

import React from 'react';
import Input from './input';
import Textarea from './textarea';
import Select from './select';
import Help from '../../help';
import { getStyles } from '../styles';

function render(Component, locals) {

  const styles = getStyles();
  const s = { width: '100%' };

  if (locals.config.kind === 'compact') {
    let error;
    if (locals.error) {
      error = locals.error && <p style={styles.errorMessage}>{locals.error}</p>;
    }
    return <label style={s}>
      <Component {...locals} />
      {error}
      <Help>{locals.help}</Help>
    </label>;
  }

  return (
    <label style={s}>
      {locals.label}
      <Component {...locals} />
      <Help>{locals.help}</Help>
    </label>
  );
}

export default {
  checkbox() {
    // TODO
  },

  list() {
    // TODO
  },

  radio() {
    // TODO
  },

  select(locals) {
    return render(Select, locals);
  },

  struct(locals) {
    const l = locals.order.length;
    let inputs = locals.order.map(function(n, i) {
      const isLast = i === l - 1;
      const s = isLast ? null : { marginBottom: 10 };

      return <div key={locals.inputs[n].key} style={s}>{locals.inputs[n]}</div>;
    });

    return <div>{inputs}</div>;
  },

  textbox(locals) {
    let C = locals.type === 'textarea' ? Textarea : Input;

    return render(C, locals);
  }
};

