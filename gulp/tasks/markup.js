'use strict';

// Gulp & plugins
var gulp = require('gulp');

// BrowserSync
var browserSync = require('browser-sync');

// Configs
var config = require('../config').markup;

gulp.task('markup', function () {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream: true}));
});
