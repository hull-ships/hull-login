'use strict';

import React from 'react';
import Input from './input';
import Textarea from './textarea';
import Select from './select';
import Checkbox from './checkbox';
import Help from '../../help';
import ErrrorMessage from '../../error';
import cssModules from 'react-css-modules';
import styles from '../form.css';

@cssModules(styles)
class Formlet extends React.Component {

  static propTypes = {
    locals: React.PropTypes.object,
    children: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.array,
      React.PropTypes.string
    ]).isRequired
  }

  render() {
    const {locals, children} = this.props;
    return (
      <span styleName="field">
        {children}
        <ErrrorMessage>{locals.error}</ErrrorMessage>
        <Help>{locals.help}</Help>
      </span>
    );
  }
}

function render(Component, locals) {
  return (
    <Formlet locals={locals}>
      <span styleName="label">{locals.label || locals.attrs.placeholder}</span>
      <Component {...locals}/>
    </Formlet>
  );
}

export default {

  checkbox(locals) {
    return (
      <Formlet locals={locals}>
        <Checkbox {...locals} />
      </Formlet>
    );
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
  }
};


