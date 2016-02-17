import _ from 'lodash';

export default {
  getInitialState() {
    this._asyncActions = {};

    return _.reduce(this.getAsyncActions(), (m, v, k) => {
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
    const instance = this;
    let timer;

    function setActionState(state, error, resetInitial) {
      clearTimeout(timer);

      if (!instance.isMounted()) { return; }

      const hash = {};
      hash[`${name}State`] = state;
      hash[`${name}Error`] = error;

      instance.setState(hash);

      if (resetInitial) {
        timer = setTimeout(function() { setActionState(null, null); }, 5000);
      }
    }

    return function() {
      const promise = action.apply(null, arguments);

      if (!promise.then) { return; }

      setActionState('pending', null);

      promise.then(function() {
        setActionState('done', null, true);
      }, function(error) {
        setActionState('failed', error, true);
      });
    };
  }
};

