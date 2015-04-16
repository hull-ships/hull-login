'use strict';

import React from 'react';
import Input from './input';
import Textarea from './textarea';
import Select from './select';

// <Input />
// <Textarea />
// <Select />
// multiple=true can be rendered as multiple checkbox
// multiple=false can be rendrer as multiple radio
// <Checkbox />
// <Datepicker />

function render(Component, locals) {
  if (locals.config.kind === 'compact') {
    return <Component {...locals} />;
  } else {
    return (
      <label>
        {locals.label}
        <Component {...locals} />
      </label>
    );
  }
}

export default {
  checkbox(locals) {
    console.log('CHECKBOX');

    return <h1>CHECKBOX</h1>;
  },

  list(locals) {
    console.log('LIST');

    return <h1>LIST</h1>;
  },

  radio(locals) {
    console.log('RADIO');

    return <h1>RADIO</h1>;
  },

  select(locals) {
    return render(Select, locals);
  },

  struct(locals) {
    let l = locals.order.length;
    let inputs = locals.order.map(function(n, i, ary) {
      let isFirst = i === 0;
      let isLast = i === l - 1;

      let s = isLast ? null : { marginBottom: 10 };

      return (
        <div style={s}>{locals.inputs[n]}</div>
      );
    });

    return <div>{inputs}</div>;
  },

  textbox(locals) {
    let C = locals.type === 'textarea' ? Textarea : Input;

    return render(C, locals);
  }
};

