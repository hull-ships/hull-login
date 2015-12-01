Login Ship
==========

A login dialog you can embed in your site.

## Manifest URL

```
https://hull-ships.github.io/hull-login/manifest.json
```

## Developing

Ensure that [Node.js](http://nodejs.org) and [gulp.js](http://gulpjs.com) are installed.

```
git clone git@github.com:hull-ships/hull-login.git
cd hull-login
npm install
gulp
```

## Grunt tasks

- Linting: `gulp lint`
- Building: `gulp build`
- Deploying: `gulp deploy`

## Events

The dialog can be controlled by triggering events. with the `Hull.emit` function.

- **`Hull.emit('hull.login.showDialog', options);`**: Opens the dialog.
- **`Hull.emit('hull.login.hideDialog', options);`**: Hides the dialog.
- **`Hull.emit('hull.login.activateLogInSection', options);`**: Opens the dialog if it is not opened and navigates to the log in section.
- **`Hull.emit('hull.login.activateSignUpSection', options);`**: Opens the dialog if it is not opened and navigates to the sign up section.
- **`Hull.emit('hull.login.activateResetPasswordSection', options);`**: Opens the dialog if it is not opened and navigates to the reset password section.
- **`Hull.emit('hull.login.activateShowProfileSection', options);`**: Opens the dialog if it is not opened and navigates to the profile section.
- **`Hull.emit('hull.login.activateEditProfileSection', options);`**: Opens the dialog if it is not opened and navigates to the edit profile section.

`options` is an optional Object passed to the next call to Hull.login() or Hull.signup(). It will persist as long as the modal is open, and disappear when it's dismissed. This way customers can switch between different tabs and sections without losing context.

It is useful to specify redirect strategies with `options.strategy`, or redirect URLs with `options.redirect_url` [Checkout the Hull.js Documentation](http://www.hull.io/docs/references/hull_js/#user-signup-and-login) for all supported options.

You can also prepopulate the user's email via `options.email`;
