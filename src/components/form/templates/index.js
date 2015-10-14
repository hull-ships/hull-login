'use strict';

import React from 'react';
import Input from './input';
import Textarea from './textarea';
import Select from './select';
import Help from '../../help';

function render(Component, locals) {
  if (locals.config.kind === 'compact') {
    let error;
    if (locals.error) {
      error = locals.error && <p styleName="error">{locals.error}</p>;
    }
    return (
      <label styleName="label">
        <Component {...locals} />
        {error}
        <Help>{locals.help}</Help>
      </label>
    );
  }

  return (
    <label styleName="label">
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
    const inputs = locals.order.map(function(n, i) {
      const isLast = i === l - 1;
      const s = isLast ? null : 'last';

      return <div key={locals.inputs[n].key} styleName={s}>{locals.inputs[n]}</div>;
    });

    return <div>{inputs}</div>;
  },

  textbox(locals) {
    const Component = locals.type === 'textarea' ? Textarea : Input;

    return render(Component, locals);
  },
};


