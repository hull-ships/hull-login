'use strict';
/* global require, console*/


var gulp        = require('gulp');
var runSequence = require('run-sequence');
var config      = require('./config');

[
  'clean',
  'cloudfront',
  'copy',
  'deploy',
  'format',
  'lint',
  'localtunnel',
  'webpack',
  // 'iconfont',
  // 'iconsprite',
  // 'sass',
  // 'serve',
  // 'sketch',
].map(function(task) { require('./gulp_tasks/' + task + '.js')(gulp, config);});


gulp.task('default', ['server']);

gulp.task('prepare', function(callback) {
  runSequence('clean', ['copy'], callback);
});

gulp.task('watch', function(callback) {
  runSequence(['copy:watch', 'lint:watch'], callback);
});

gulp.task('serve', function(callback) {
  runSequence(['webpack:server','localtunnel'], callback);
});

// Batch, Public Tasks
gulp.task('server', function(callback) {
  runSequence('prepare', 'watch', 'serve', callback);
});

gulp.task('build', function(callback) {
  runSequence('prepare', 'webpack', callback);
});

gulp.task('deploy', function(callback) {
  runSequence('build', 'gh:deploy', 'cloudfront', callback);
});
