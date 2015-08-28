function wrapCustomer(data) {
  let h = {};

  for (let k in data) {
    if (data.hasOwnProperty(k) && data[k] != null) {
      h['customer[' + k + ']'] = data[k];
    }
  }

  return h;
}

function shopifyLogin(email, password) {
  let { superagent, Promise } = Hull.utils;
  let url = document.location.origin + '/account/login';
  let formData = {
    return_to: document.location.origin + '/___RETURN_TO___',
    form_types: 'customer_login',
    ...wrapCustomer({ email, password })
  };

  return new Promise((resolve, reject) => {
    superagent.post(url)
      .type('form')
      .send(formData)
      .end((error, response={}) => {
        const status = { response };
        if (response && response.status === 404) {
          resolve({ error, response, status });
        } else {
          reject(new Error('invalid credentials'));
        }
      });
  });
}

function classicLogin(options) {
  const params = {
    email: options.email || options.login,
    password: options.password
  };
  return Hull.api('services/shopify/customers/login', params, 'post').then(()=> {
    const { email, password } = params;
    return shopifyLogin(email, password);
  });
}


function socialLogin(options) {
  return Hull.login({
    redirect_url: Hull.config('callbackUrl') || document.location.origin + '/a/hull-callback',
    ...options
  });
}

export function signUp(options) {
  const password = { options };
  return Hull.api('services/shopify/customers', options, 'post').then((user)=> {
    const { email } = user;
    return shopifyLogin(email, password);
  });
}

export function logIn(options) {
  return (!options.provider) ?
    classicLogin(options) : socialLogin(options);
}

export function resetPassword(email) {
  return Hull.api('services/shopify/customers/request_password_reset', 'post', { email });
}
