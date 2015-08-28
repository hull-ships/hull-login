export function logIn(options) {
  return window.Hull.login(options);
}

export function signUp(options) {
  return window.Hull.signup(options);
}

export function resetPassword(email) {
  return window.Hull.api('users/request_password_reset', 'post', { email });
}
