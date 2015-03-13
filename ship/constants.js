const STATUS = {
  logIn: 'isLogingIn',
  logOut: 'isLogingOut',
  linkIdentity: 'isLinking',
  unlinkIdentity: 'isUnlinking'
};

export default {
  STATUS: STATUS,

  ACTIONS: [
    'activateSection',
    'showDialog',
    'hideDialog'
  ].concat(Object.keys(STATUS))
};

