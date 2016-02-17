'use strict';

/* global module, require, process, __dirname */

var _ = require('lodash');
var webpack = require('webpack');
var path = require('path');
var moment = require('moment');

var pkg = require('./package.json');
var manifest = require('./manifest.json');

// DO NOT CHANGE FOLDERS
// WIHTOUT UPDATING PACKAGE.JSON TOO.
var sourceFolder = 'src';
var outputFolder = 'dist';
var assetsFolder = '';
var serverPort = process.env.PORT || 8081;
var previewUrl = 'http://localhost:' + serverPort;

var hotReload = true;

var libName = pkg.name;
var displayName = manifest.name || libName;

// DO NOT CHANGE SHIP ENTRY
// WITHOUT UPDATING PACKAGE.JSON TOO
// THESE ARE THE JS FILES USED AS ENTRY POINTS TO COMPILE YOUR APP


/*
  --------------------------------
  Compiled JS files
  --------------------------------
*/
var entry = {
  ship: './' + sourceFolder + '/ship.js',
  index: './' + sourceFolder + '/index.js',
  test: './' + sourceFolder + '/test.js',
};

/*
  --------------------------------
  Sketch icons extraction
  --------------------------------
*/
var sketch = {
  export: 'artboards',
  formats: 'svg',
};

/*
  --------------------------------
  SVGO Icons Optimization
  --------------------------------
*/
var imagemin = {
  progressive: true,
  svgoPlugins: [{
    removeViewBox: false,
    convertTransform: true,
  }],
};

/*
  --------------------------------
  iconfont generation
  --------------------------------
*/
var icons = {
  folder: path.join(sourceFolder, 'icons'),
  src: path.join(sourceFolder, 'icons', '**', '*'),
  fontPath: path.join('../', assetsFolder, 'fonts'),

  output: {
    sprite: path.join(outputFolder, assetsFolder),
    font: path.join(outputFolder, assetsFolder, 'fonts'),
    css: path.join(sourceFolder, 'styles'),
  },

  sprite: {
    shape: {
      dimension: { maxWidth: 32, maxHeight: 32 },
      spacing: { padding: 0 },
    },
    mode: {
      view: { bust: false, dest: 'sprite', render: { scss: false } },
    },
  },

  font: {
    fontName: libName + 'Font',
    fontHeight: 1001,
    normalize: true,
    formats: ['ttf', 'eot', 'woff', 'svg'],
    timestamp: Math.round(Date.now() / 1000),
  },
};


/*
  --------------------------------
  Copied files
  --------------------------------
*/
var files = {
  'src/vendors/**/*': path.join(outputFolder, assetsFolder, 'vendors'),
  'src/images/**/*': path.join(outputFolder, assetsFolder, 'images'),
  'src/icons/**/*': path.join(outputFolder, assetsFolder, 'icons'),
  'src/locales/**/*': path.join(outputFolder, 'locales'),
  'manifest.json': outputFolder,
  'src/*.md': outputFolder,
  'src/*.ico': outputFolder,
  'src/*.jpg': outputFolder,
  'src/*.png': outputFolder,
  'src/*.html': outputFolder,
  'CNAME': outputFolder,
};

var output = {
  path: path.join(__dirname, outputFolder, assetsFolder, '/'),
  pathinfo: true,
  filename: '[name].js',
  chunkFileName: '[name].chunk.js',
  publicPath: assetsFolder + '/',
};

var resolve = { extensions: ['', '.js', '.jsx', '.css', '.scss'] };

// SASS-LIKE :
// postcss-simple-vars
// postcss-advanced-vars
// postcss-sassy-mixins
// postcss-simple-extend
// postcss-vertical-rhythm
var postcss = [
  require('precss')({ /* options */ }), // Sass-like syntax
  require('postcss-round-subpixels'),
  /* IE */
  require('postcss-pseudoelements'),
  require('postcss-color-rgba-fallback'),
  require('postcss-opacity'),
  require('postcss-vmin'),
  /* END IE */
  require('postcss-initial'), // all:initial
  require('cssnext'),
  require('cssnano')({safe: true}), // Condense & Optimize
];

// about babel : it's VERY SLOW. DO NOT APPLY IT TO EVERY SOURCE FILE. see the Excludes we applied
var loaderLibrary = {
  json: {test: /\.json$/, loader: 'json' },
  css: {test: /\.(css|scss)$/, loaders: ['style?singleton=true', 'css?modules&importLoaders=1', 'postcss'] },
  devCss: {test: /\.(css|scss)$/, loaders: ['style?singleton=true', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'postcss'] },
  file: {test: /\.jpe?g$|\.gif$|\.png|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: 'file' },
  svg: {test: /\.svg$/, loader: 'svg-inline' },
  js: {test: /\.(js)$/, loader: 'babel', exclude: /node_modules|src\/vendors/ },
  prodJSX: {test: /\.(jsx)$/, loader: 'babel' },
  devJSX: {test: /\.(jsx)$/, loaders: ['react-hot', 'babel'] },
};

var devLoaders = [
  loaderLibrary.json,
  loaderLibrary.devCss,
  loaderLibrary.file,
  loaderLibrary.js,
  (hotReload ? loaderLibrary.devJSX : loaderLibrary.prodJSX)
];

var loaders = [
  loaderLibrary.json,
  loaderLibrary.css,
  loaderLibrary.file,
  loaderLibrary.js,
  loaderLibrary.prodJSX,
];



// We remove the 'dist' from the filenames for demo and index.html in package.json
// Package.json expects our files to be addressable from the same repo
// We put them in `dist` to have a clean structure but then we need to build them in the right place
var plugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
  new webpack.optimize.OccurenceOrderPlugin(),
  // new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename: 'vendors.js', minChunks: Infinity}),
  new webpack.DefinePlugin({
    BUILD_DATE: JSON.stringify(moment().format('MMMM, DD, YYYY, HH:mm:ss')),
    PUBLIC_PATH: JSON.stringify(output.publicPath),
  }),
];


/*
  ----------------------------
  LOCALTUNNEL
  ----------------------------
*/
var localtunnel = {
  subdomain: libName.toLowerCase().replace(/[-_]/g, ''),
};


/*
  ----------------------------
  CLOUDFRONT
  ----------------------------
*/
var cloudfront;
if (process.env.AWS_KEY && process.env.AWS_SECRET) {
  var cloudfrontInvalidations = ['/' + libName + '/*'];
  cloudfront = {
    config: {
      credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
      },
      distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
      region: 'us-east-1',
    },
    invalidationBatch: {
      CallerReference: new Date().toString(),
      Paths: {
        Quantity: cloudfrontInvalidations.length,
        Items: cloudfrontInvalidations,
      },
    },
  };
}

/*
  ----------------------------
  DEV MODE / HOT RELOAD overrides
*/
var devPlugins, devEntry;
if (hotReload) {
  devEntry = _.reduce(entry, function(entries, v, k) {
    entries[k] = [ 'webpack-dev-server/client?' + previewUrl, 'webpack/hot/only-dev-server', v ];
    return entries;
  }, {});
  devPlugins = plugins.concat([new webpack.HotModuleReplacementPlugin()]);
} else {
  devEntry = entry;
  devPlugins = plugins;
}

module.exports = {

  libName: libName,
  displayName: displayName,

  hotReload: hotReload,
  localtunnel: localtunnel,
  cloudfront: cloudfront,

  files: files,

  sketch: sketch,
  imagemin: imagemin,
  icons: icons,

  sourceFolder: sourceFolder,
  outputFolder: outputFolder,
  assetsFolder: assetsFolder,
  serverPort: serverPort,
  previewUrl: previewUrl,

  devEntry: devEntry,

  entry: entry,
  output: output,

  plugins: plugins,
  devPlugins: devPlugins,
  devLoaders: devLoaders,

  resolve: resolve,
  loaders: loaders,

  postcss: postcss,

  pkg: pkg,

};
