var ngrok = require('ngrok');
var gutil = require("gulp-util");
var assign = require("object-assign");

// Setup a Ngrok server
module.exports = function(gulp, config){

  gulp.task('ngrok', function(callback){
    if (!config.ngrok){
      return callback();
    }

    ngrok.connect(config.ngrok, function (error, url) {

      if (error) throw new gutil.PluginError('ship:server', error);

      url = url.replace('https', 'http');
      gutil.log('[ship:server]', url);

    });

  });
}
