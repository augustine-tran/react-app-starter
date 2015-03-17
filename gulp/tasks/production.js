'use strict';

// Gulp & plugins
var gulp = require('gulp');

// Run this to compress all the things!
gulp.task('production', function() {
  gulp.start(['clean', 'markup', 'images', 'fonts', 'minifyCss', 'uglifyJs'])
});
