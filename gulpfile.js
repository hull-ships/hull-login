'use strict';
/*eslint-disable no-var*/
/*global require, console*/

var _ = require('underscore');
var path = require('path');
var del = require('del');
var runSequence = require('run-sequence');

var gulp = require('gulp');
var gutil = require('gulp-util');
var ghpages = require('gh-pages');
var notifier = require('node-notifier');

var ngrok = require('ngrok');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

// Get our Config.
var config = require('./config');
var webpackConfig = require('./webpack.config');
var webpackDevCompiler = webpack(webpackConfig.development.browser);


// Task Bundles
gulp.task('default', ['server']);
gulp.task('serve', ['server']);

gulp.task('server', function(callback) {runSequence('clean', 'copy-files:watch', 'webpack:server', callback); });
gulp.task('build', function(callback) {runSequence('lint', 'clean', 'copy-files', 'webpack:build', callback); });
gulp.task('deploy', function(callback) {runSequence('build', 'gh:deploy', callback); });


function notify(message) {
  notifier.notify({
    title: config.displayName + ' Gulp',
    message: message
  });
}

// Handle Gulp Errors
function handleError(err, taskName) {
  if (err) {
    notify(taskName + ' Error: ' + err);
    throw new gutil.PluginError('webpack:build', err);
  }
}

// Raise errors on Webpack build errors
function webpackFeedbackHandler(err, stats) {
  var jsonStats = stats.toJson();
  handleError(err);

  if (jsonStats.errors.length > 0) {
    gutil.log('[webpack:build:error]', JSON.stringify(jsonStats.errors));
    throw new gutil.PluginError('webpack:build:error', JSON.stringify(jsonStats.errors));
  }

  // Don't throw an error here : Uglify uses a lot of warnings to mention stripped code
  if (jsonStats.warnings.length > 0) {
    gutil.log('[webpack:build:warning]', JSON.stringify(jsonStats.warnings, null, 2));
  }
}

// Copy static files from the source to the destination
function copyFiles(callback) {
  _.map(config.files, function(dest, src) {
    gulp.src(src).pipe(gulp.dest(dest));
  });

  notify('Vendors Updated');

  if (_.isFunction(callback)) {
    callback();
  }
}

// Setup a Ngrok server
function ngrokServe(subdomain) {
  var options = { port: config.serverPort };
  var env = process.env;
  if (env.NGROK_AUTHTOKEN && (env.NGROK_SUBDOMAIN || subdomain)) {
    options.authtoken = env.NGROK_AUTHTOKEN;
    options.subdomain = env.NGROK_SUBDOMAIN || subdomain;
  }

  ngrok.connect(options, function(error, url) {
    if (error) throw new gutil.PluginError('ship:server', error);

    url = url.replace('https', 'http');
    notify({
      message: ' Ngrok Started on ' + url
    });

    gutil.log('[ship:server]', url);
  });
}

/**
 * GULP TASKS START HERE
*/


// Cleanup build folder
gulp.task('clean', function(cb) {
  del([ './' + config.outputFolder + '/**/*' ], cb);
});

// One-time file copy
gulp.task('copy-files', copyFiles);

// Watch files for changes and copy them
gulp.task('copy-files:watch', function() {
  copyFiles();
  gulp.watch(_.keys(config.files), copyFiles);
});


// Production Build.
// Minified, clean code. No demo keys inside.
// demo.html WILL NOT WORK with this build.
//
// Webpack handles CSS/SCSS, JS, and HTML files.
gulp.task('webpack:build', function(callback) {
  // Then, use Webpack to bundle all JS and html files to the destination folder
  notify('Building App');
  webpack(_.values(webpackConfig.production), function(err, stats) {
    var feedback = webpackFeedbackHandler(err, stats);
    gutil.log('[webpack:build]', stats.toString({ colors: true }));
    notify({ message: 'App Built' });
    callback(feedback);
  });
});

// Dev Build
// Create the webpack compiler here for caching and performance.


// Build a Dev version of the project. Launched once on startup so we can have eveything copied.
gulp.task('webpack:build:dev', function(callback) {
  // run webpack with Dev profile.
  // Embeds the Hull config keys, and the necessary stuff to make demo.html work
  webpackDevCompiler.run(function(err, stats) {
    var feedback = webpackFeedbackHandler(err, stats);
    gutil.log('[webpack:build:dev]', stats.toString({ colors: true }));
    notify({ message: 'Webpack Updated' });
    callback(feedback);
  });
});

// Launch webpack dev server.
gulp.task('webpack:server', function() {
  var taskName = 'webpack:server';
  new WebpackDevServer(webpackDevCompiler, {
    contentBase: config.outputFolder,
    publicPath: '/' + config.assetsFolder,
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: config.hotReload,
    stats: {colors: true }
  }).listen(config.serverPort, function(err) {
    // Dump the preview URL in the console, and open Chrome when launched for convenience.
    var url = webpackConfig.development.browser.output.publicPath + 'webpack-dev-server/';

    handleError(err, taskName);
    gutil.log('[' + taskName + '] started at ', url);
    notify({ message: 'Dev Server Started' });
    ngrokServe(config.libName);
  });
});

// Deploy production bundle to gh-pages.
gulp.task('gh:deploy', function(callback) {
  notify('Deploying ' + config.outputFolder + ' to Github Pages');
  ghpages.publish(path.join(process.cwd(), config.outputFolder), callback);
});

gulp.task('lint', function() {
  var eslint = require('gulp-eslint');
  return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

