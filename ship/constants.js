const STATUS = {
  login: 'isLogingIn',
  logout: 'isLogingOut',
  linkIdentity: 'isLinking',
  unlinkIdentity: 'isUnlinking'
};

export default {
  STATUS: STATUS,

  ACTIONS: [
    'showDialog',
    'hideDialog'
  ].concat(Object.keys(STATUS))
};

