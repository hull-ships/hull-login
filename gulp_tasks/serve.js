var gutil = require('gulp-util');
var gulp_live_server   = require('gulp-live-server');

module.exports = function(gulp, config){
  // Launch Dashboard Server + Proxy. Inject Dev Middleware.
  gulp.task('express', function() {
    var server = gulp_live_server('server/index.js', {}, false);
    server.start();
    return gulp.watch(['server/**/*.js', 'queries/**/*js'], server.start);
  });
}
