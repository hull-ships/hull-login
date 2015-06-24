'use strict';

import React from 'react';
import Input from './input';
import Textarea from './textarea';
import Select from './select';

function render(Component, locals) {
  if (locals.config.kind === 'compact') {
    return <Component {...locals} />;
  }

  const s = { width: '100%' }
  return (
    <label style={s}>
      {locals.label}
      <Component {...locals} />
      {locals.help}
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

