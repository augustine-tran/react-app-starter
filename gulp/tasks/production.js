'use strict';

// Gulp & plugins
var gulp = require('gulp');

// Run this to compress all the things!
gulp.task('production', ['clean'], function () {
    gulp.start(['assets', 'minifyCss', 'uglifyJs', 'templates', 'images', 'fonts', 'markup']);
});
