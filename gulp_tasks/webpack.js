var _                = require('lodash');
var webpack          = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var gutil            = require('gulp-util');

function handleError(err) {
  if (err) {
    throw new gutil.PluginError('webpack:build', err);
  }
}

// Raise errors on Webpack build errors
function webpackFeedbackHandler(err, stats){
  handleError(err);
  if(stats){
    var st = stats.toJson();

    if(st.errors.length > 0){
      // gutil.log("[webpack:build:error]", JSON.stringify(st.errors));
      throw new gutil.PluginError("webpack:build:error", JSON.stringify(st.errors));
    }

    // Don't throw an error here : Uglify uses a lot of warnings to mention stripped code
    // if(st.warnings.length > 0){
    //   gutil.log("[webpack:build:warning]", JSON.stringify(st.warnings,null,2));
    // }
    gutil.log('[webpack:build]', stats.toString({ colors: true }));
  }
};

module.exports = function(gulp, config){

  var webpackConfig = require('../webpack.config')(config);

  //Production Build.
  //Minified, clean code. No demo keys inside.

  gulp.task('webpack', function(callback) {
    // Then, use Webpack to bundle all JS and html files to the destination folder
    webpack(webpackConfig.production, function(err, stats) {
      if(err){
        webpackFeedbackHandler(err, stats)
        return callback(err)
      }
      callback();
    });
  });

  // Launch webpack dev server.
  gulp.task("webpack:server", function(callback) {

    var taskName = "webpack:server";
    var server = new WebpackDevServer(webpack(webpackConfig.development), {
      noInfo      : false,
      stats       : {colors: true },
      headers     : { "Access-Control-Allow-Origin": "*" },
      contentBase : config.outputFolder,
      hot         : config.hotReload
    }).listen(config.serverPort, function(err) {

      webpackFeedbackHandler(err)

      // Dump the preview URL in the console, and open Chrome when launched for convenience.
      var url = webpackConfig.development.output.publicPath+"webpack-dev-server/";
      gutil.log("["+taskName+"] started at ", url);

      callback()
    });
  });

}


