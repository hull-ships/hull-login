Login Ship
==========

A Login Dialog [Ship](http://hull.io/ships) you can embed in your site built with [React](http://facebook.github.io/react/). 

## Manifest URL

    https://hull-ships.github.io/hull-login/manifest.json

## Ship Options

[todo]

## Building Ships

You can use the tooling of your choice to build Ships, they're technology-agnostic. However, after spending months building them, we've settled on a stack that's a combination of sheer power and ease of use. We recommend it strongly.

##### Setting up your development environment

- First, Create a Platform with URL you will use to demo your ship. For instance, this ship is hosted at `http://hull-ships.github.io/hull-login`.
- Copy the snippet, paste it in `index.html`
- In the dashboard, click `Add Ship > From URL`.
- Enter the url of the `manifest.json` (it must be publicly accessible), give a name to your ship.


##### Ship Architecture
```
/index.html //Demo Page. Contains Hull.js library
/index.js   // Manual Ship embed, optional.
/ship.html  // Ship HTML Import, Embedded by Hull.js on boot
/ship.js    // Ship entry point. Loaded from ship.html.
```

Ships are loaded as `deployments` inside a `platform`.


##### Read about:
Using this setup, You get [Scoped Styles](STYLES_SANDBOX.md), [React Hot Code Replacement](https://github.com/gaearon/react-hot-loader), [Webpack](http://webpack.github.io/) with Automatic Reloading of all assets, and [React](http://facebook.github.io/react/), for free, baked in and ready to use.

__Enjoy the future__.

## Setup
- Install [Node.js](http://nodejs.org), [Bower](http://bower.io/), [Webpack](http://webpack.github.io) [Gulp](http://gulpjs.com/) if not done already, and project dependencies:

```sh
# First, install node+npm from http://nodejs.org/download/
npm install -g bower gulp webpack
npm install
```

- Run `gulp server`
- Open `http://localhost:8081/demo.html`. Your ship should load. The main entry point is `ship.js`
- [Ngrok](https://ngrok.com/) will start and serve `http://[NAME_IN_PACKAGE_JSON)].ngrok.com` - For now we don't do any checking, so ensure no one else is using this subdomain at the time.

## Development

- Run `gulp server` and visit [http://localhost:8081/demo.html](http://localhost:8080/demo.html).
- Write Code
- Drink Coffee
- Be nice to others
- Repeat
- Publish

## Build
- When publishing, the manifest file and assets must be publicly available so Hull can use your ship.
- run `gulp build`

## Deployment
- Publish anywhere you like, as long the following files are public:
- `manifest.json`
- `locales` folder with `en.json` at least
- `index.html`
- `ship.js`
 
A good way to start is by publishing the built project to the `gh-pages` branch, and linking to the `github.io` public URL. 

The included `gulp deploy` task will do this for you.
