function wrapCustomer(data) {
  const h = {};

  for (const k in data) {
    if (data.hasOwnProperty(k) && !!data[k]) {
      h['customer[' + k + ']'] = data[k];
    }
  }

  return h;
}

function shopifyLogin(email, password, options = {}, user) {
  const { superagent, Promise } = Hull.utils;
  const url = document.location.origin + '/account/login';
  const formData = {
    return_to: '/___RETURN_TO___',
    form_types: 'customer_login',
    ...wrapCustomer({ email, password }),
  };

  return new Promise((resolve, reject) => {
    superagent.post(url)
      .type('form')
      .send(formData)
      .end((...res) => {
        const response = res[res.length - 1] || {};
        if ((response && response.status === 404) || (response.xhr && (response.xhr.responseURL || '').match(/password$/))) {
          resolve(user);
        } else {
          reject({
            status: 401,
            message: 'invalid credentials',
            reason: 'invalid_credentials',
            provider: 'classic',
          });
        }
      });
  });
}

function classicLogin(options = {}) {
  const params = {
    email: options.email || options.login,
    password: options.password,
  };
  return Hull.api('services/shopify/customers/login', params, 'post').then((user)=> {
    const { email, password } = params;
    return shopifyLogin(email, password, options, user);
  });
}

function socialLogin(options = {}) {
  let url = Hull.config('callbackUrl') ||
            `${document.location.origin}/a/hull-callback`;
  if (options.redirect_url) {
    url = `${url}?redirect_url=${options.redirect_url}`;
  }
  return Hull.login({ ...options, redirect_url: url });
}

export function signUp(options = {}) {
  const { password } = options;
  return Hull.api(
    'services/shopify/customers',
    'post',
    options
  ).then((user)=> {
    const { email } = user;
    return shopifyLogin(email, password, options, user);
  });
}

export function logIn(options) {
  return (!options.provider) ?
    classicLogin(options) : socialLogin(options);
}

export function resetPassword(email) {
  return Hull.api(
    'services/shopify/customers/request_password_reset',
    'post',
    { email }
  );
}

export function logOut(/* options */) {
  return Hull.logout({ redirect_url: `${document.location.origin}/account/logout` });
}

