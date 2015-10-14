var eslint = require('gulp-eslint');

// Formats your sourcecode to be more pretty.
module.exports = function(gulp, config){

  gulp.task('lint', function() {
    return gulp.src(['src/**/*.js', 'src/**/*.jsx', '!src/vendors/**'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  });


  gulp.task('lint:watch', function() {
    return gulp.watch(['src/**/*.js', 'src/**/*.jsx'], { debounceDelay: 300 }, ['lint']);
  });
}
