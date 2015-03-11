var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var path = require('path');
var open = require('open');
var ngrok = require('ngrok');
var deploy = require('gulp-gh-pages');
var es = require('event-stream');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');

var SHIP_PORT = 8480;

var PREVIEW_PORT = SHIP_PORT + 1;

var LOADERS = [
  { test: /\.json$/, loaders: ['json-loader'] },
  { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules|bower_components/ },
  { test: /\.jsx$/, loaders: ['react-hot', 'babel-loader'] },
  {
    test: /\.(css|scss)$/,
    loaders: [
      'style/useable',
      'css-loader',
      'sass-loader?outputStyle=expanded',
      'autoprefixer-loader?browsers=last 2 version'
    ]
  }
];

var SHIP_ENTRY = 'ship';

var SHIP_FOLDER = '__ship__';

var SHIP_WEBPACK = {
  entry: './' + SHIP_ENTRY,
  output: {
    path: __dirname + '/' + SHIP_FOLDER,
    filename: 'bundle.js'
  },
  module: {
    loaders: LOADERS
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      minimize:true,
      ascii_only:true,
      quote_keys:true,
      sourceMap: false,
      beautify: false,
      compress: { drop_console: true }
    }),
  ]
};

gulp.task('ship:clean', function(callback) {
  rimraf(SHIP_FOLDER, callback);
});

gulp.task('ship:webpack', function(callback) {
  webpack(SHIP_WEBPACK, function(error) {
    if (error) throw new gutil.PluginError('ship:webpack', error);

    callback();
  })
});

gulp.task('ship:build', function(callback) {
  runSequence('ship:clean', 'ship:webpack', 'ship:copy', callback);
});

var SHIP_FILES = [
  'manifest.json',
  'ship/index.html',
  'ship/locales/*.json'
];

function copyShipFiles(callback) {
  es.concat(
    gulp.src(['manifest.json', 'ship/index.html']).pipe(gulp.dest(SHIP_FOLDER)),
    gulp.src(['ship/locales/*.json'], { base: './ship' }).pipe(gulp.dest(SHIP_FOLDER))
  ).on('end', callback || gutil.noop);
}

gulp.task('ship:copy', copyShipFiles);

gulp.task('ship:copy-watch', function(){
  copyShipFiles()

  gulp.watch(SHIP_FILES, copyShipFiles);
});

gulp.task('ship:github', function () {
  return gulp.src(SHIP_FOLDER + '/**/*').pipe(deploy({}));
});

gulp.task('ship:deploy', function(callback) {
  runSequence('ship:build', 'ship:github', callback);
});

gulp.task('ship:server', ['ship:clean', 'ship:copy-watch'], function() {
  var server = new WebpackDevServer(webpack(SHIP_WEBPACK), {
    contentBase: SHIP_FOLDER,
    headers: { 'Access-Control-Allow-Origin': '*' }
  });

  server.listen(SHIP_PORT, 'localhost', function(error) {
    if (error) throw new gutil.PluginError('ship:server', error);

    gutil.log('[ship:server]', 'http://localhost:' + SHIP_PORT + '/webpack-dev-server/index.html');

    var options = { port: SHIP_PORT };
    var e = process.env;
    if (e.NGROK_AUTHTOKEN && e.NGROK_SUBDOMAIN) {
      options.authtoken = e.NGROK_AUTHTOKEN;
      options.subdomain = e.NGROK_SUBDOMAIN;
    }
    ngrok.connect(options, function (error, url) {
      if (error) throw new gutil.PluginError('ship:server', error);

      url = url.replace('https', 'http');

      gutil.log('[ship:server]', url);
      open(url, 'chrome');
    });
  });
});

var PREVIEW_ENTRY = 'preview';

var PREVIEW_FOLDER = '__preview__';

var PREVIEW_WEBPACK = {
  entry: {
    ship: [
      'webpack-dev-server/client?http://localhost:' + PREVIEW_PORT,
      'webpack/hot/only-dev-server',
      './' + PREVIEW_ENTRY
    ]
  },
  output: {
    path: __dirname + '/' + PREVIEW_FOLDER,
    filename: 'bundle.js'
  },
  module: {
    loaders: LOADERS
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

gulp.task('preview:clean', function(callback) {
  rimraf(PREVIEW_FOLDER, callback);
});

var PREVIEW_FILES = ['preview/index.html']

function copyPreviewFiles() {
  return gulp.src(PREVIEW_FILES).pipe(gulp.dest(PREVIEW_FOLDER));
}

gulp.task('preview:copy-watch', function(){
  copyPreviewFiles()
  gulp.watch(PREVIEW_FILES, copyPreviewFiles);
});

gulp.task('preview:server', ['preview:clean', 'preview:copy-watch'], function() {
  var server = new WebpackDevServer(webpack(PREVIEW_WEBPACK), {
    contentBase: PREVIEW_FOLDER,
    hot: true
  });

  server.listen(PREVIEW_PORT, 'localhost', function(error) {
    if (error) throw new gutil.PluginError('preview:server', error);

    gutil.log('[preview:server]', 'http://localhost:' + PREVIEW_PORT + '/webpack-dev-server/index.html');
  });
});

