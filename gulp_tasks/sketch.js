var sketch         = require('gulp-sketch');
var imagemin       = require('gulp-imagemin');

module.exports = function(gulp, config){

  gulp.task('sketch', function(){

    if(!config.sketch || !config.icons.folder || !config.imagemin){ throw new gutil.PluginError('sketch', 'sketch is not configured properly, checkout config.js'); }

    return gulp.src('symbols.sketch')
      .pipe(sketch(config.sketch))
      .pipe(imagemin(config.imagemin))
      .pipe(gulp.dest(config.icons.folder))

  });


  gulp.task('sketch:watch', function(){
    return gulp.watch('*.sketch', { debounceDelay: 3000 }, ['sketch', 'imagemin']);
  });

}
