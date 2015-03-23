'use strict';

// Gulp & plugins
var gulp = require('gulp');
var changed = require('gulp-changed');

// BrowserSync
var browserSync = require('browser-sync');

// Configs
var config = require('../config').templates;

gulp.task('templates', function () {
    return gulp.src(config.src)
        .pipe(changed(config.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream: true}));
});
