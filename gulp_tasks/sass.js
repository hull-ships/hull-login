var rename = require('gulp-rename');
var sass = require('gulp-sass');

module.exports = function(gulp, config){

  gulp.task('sass', function () {
    return gulp.src('./src/styles/foundation.scss')
      .pipe(sass({
        includePaths:['node_modules']
      }).on('error', sass.logError))
      .pipe(rename({basename:'foundation-flat'}))
      .pipe(gulp.dest('./src/styles'));
  });
   
  gulp.task('sass:watch', function () {
    return gulp.watch('./src/styles/foundation.scss', ['sass']);
  });


}
