var ghpages = require('gh-pages');
var path = require('path');
var git = require('git-rev-sync');
var pkg = require('../package.json');
var gutil = require('gulp-util');


module.exports = function(gulp, config){
  // Deploy production bundle to gh-pages.
  gulp.task("gh:deploy", function (callback) {
    var basePath = path.join(__dirname,'..', config.outputFolder);
    var options = {
      message: 'Deployed version ' + pkg.version + ' - rev. ' + git.short()
    };
    return ghpages.publish(basePath, options, callback);
  });

}
