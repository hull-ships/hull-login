var rename         = require('gulp-rename');
var svgSprite      = require('gulp-svg-sprite');

module.exports = function(gulp, config){

  var icons        = config.icons;
  var src       = icons && icons.src;
  var spriteConfig = icons && icons.sprite;
  var output       = icons && icons.output;

  gulp.task('iconsprite', function(){

    if(!icons || !spriteConfig || !src || !output.sprite){
      throw new gutil.PluginError('iconsprite', 'iconsprite is not configured properly, checkout config.js');
    }

    return gulp.src(src).
      .pipe(svgSprite(spriteConfig))
      .pipe(rename({basename: 'sprite'}))
      .pipe(gulp.dest(output.sprite));

  });

  gulp.task('iconsprite:watch', function(){
    return gulp.watch(src, { debounceDelay: 3000 }, ['iconsprite']);
  });

}
