'use strict';

let { superagent, Promise } = Hull.utils;

function wrap(data) {
  let h = {};

  for (let k in data) {
    if (data.hasOwnProperty(k) && data[k] != null) {
      h['customer[' + k + ']'] = data[k];
    }
  }

  return h;
}

const NONEXISTENT_URL = '/___RETURN_TO___';

export function logIn(data) {
  let url = document.location.origin + '/account/login';

  return new Promise((resolve, reject) => {
    superagent.post(url).type('form').send({
      'form_types': 'customer_login',
      'return_to': NONEXISTENT_URL,
      ...wrap(data)
    }).end((error) => {
      // When log in succeeds, the user is redirected to `return_to` value
      // which is an URL that does not exist.
      if (error != null) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

export function signUp(data) {
  let url = document.location.origin + '/account';
  return new Promise((resolve, reject) => {
    superagent.post(url).type('form').send({
      'form_types': 'create_customer',
      ...wrap(data)
    }).end((error, response) => {
      // When sign up succeeds, the user is redirected to the account page.
      if (response && response.xhr && response.xhr.responseURL === url) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

export function resetPassword(data) {
  let o = document.location.origin;
  let url = o + '/account/recover';
  return new Promise((resolve, reject) => {
    superagent.post(url).type('form').send({
      'form_types': 'recover_customer_password',
      ...data
    }).end((error, response) => {
      // When reset succeeds, the user is redirected to the log in page.
      // Or a CrossDomain error happens. Handle it in a hackish way for now.
      if ((response && response.xhr && response.xhr.responseURL === o + '/account/login') || ( error && error.toString().indexOf('Access-Control-Allow-Origin') > 0 )) {
        resolve();
      } else {
        let message;
        // Don't use "error" here : we don't want to surface system errors, just Reset password messages
        if (response && response.xhr) {
          message = (response.xhr.status > 400) ? response.xhr.statusText : null;
        }
        reject(message);
      }
    });
  });
}
