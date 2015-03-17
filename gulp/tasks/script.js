'use strict';

// Gulp & plugins
var gulp         = require('gulp');
var webpack = require('gulp-webpack');

// BrowerSync
var browserSync  = require('browser-sync');

// Utilities
var handleErrors = require('../util/handleErrors');

// Configs
var config = require('../config').scripts;

gulp.task('script', function() {
  return gulp.src(config.src)
    .pipe(webpack(config.options))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
