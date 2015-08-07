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

### `Hull.emit('hull.ship.login.showDialog');`

Opens the dialog.

### `Hull.emit('hull.ship.login.hideDialog');`

Hides the dialog.

### `Hull.emit('hull.ship.login.activateLogInSection');`

Opens the dialog if it is not opened and navigates to the log in section.

### `Hull.emit('hull.ship.login.activateSignUpSection');`

Opens the dialog if it is not opened and navigates to the sign up section.

### `Hull.emit('hull.ship.login.activateResetPasswordSection');`

Opens the dialog if it is not opened and navigates to the reset password section.

### `Hull.emit('hull.ship.login.activateShowProfileSection');`

Opens the dialog if it is not opened and navigates to the profile section.

### `Hull.emit('hull.ship.login.activateEditProfileSection');`

Opens the dialog if it is not opened and navigates to the edit profile section.
