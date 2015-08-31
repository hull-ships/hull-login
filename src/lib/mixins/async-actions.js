import { reduce } from 'underscore';

export default {
  getInitialState() {
    this._asyncActions = {};

    return reduce(this.getAsyncActions(), (m, v, k) => {
      this._asyncActions[k] = this._processAction(v, k);

      m[`${k}State`] = null;
      m[`${k}Error`] = null;

      return m;
    }, {});
  },

  getAsyncAction(name) {
    return this._asyncActions[name];
  },

  _processAction(action, name) {
    let instance = this;
    let timer;

    function setActionState(state, error, resetInitial) {
      clearTimeout(timer);

      if (!instance.isMounted()) { return; }

      let h = {};
      h[`${name}State`] = state;
      h[`${name}Error`] = error;

      instance.setState(h);

      if (resetInitial) {
        timer = setTimeout(function() { setActionState(null, null); }, 5000);
      }
    }

    return function() {
      let p = action.apply(null, arguments);

      if (p.then == null) { return; }

      setActionState('pending', null);

      p.then(function() {
        setActionState('done', null, true);
      }, function(error) {
        setActionState('failed', error, true);
      });
    };
  }
};

