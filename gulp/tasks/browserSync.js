'use strict';

// Gulp & plugins
var gulp = require('gulp');

// BrowerSync
var browserSync = require('browser-sync');

// Configs
var config = require('../config').browserSync;

gulp.task('browserSync', ['nodemon'], function () {
    browserSync(config);
});
