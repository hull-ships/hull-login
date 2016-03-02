export default {
  getItem(key) {
    let ret;
    try {
      const val = window.localStorage.getItem(key);
      if (val) {
        ret = JSON.parse(val);
      }
    } catch (err) {
      ret = null;
    }
    return ret;
  },
  setItem(key, val) {
    let ret;
    try {
      ret = JSON.stringify(val);
      window.localStorage.setItem(key, ret);
    } catch (err) {
      ret = null;
    }
    return ret;
  }
};
