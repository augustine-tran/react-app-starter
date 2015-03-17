'use strict';

// Gulp & plugins
var gulp = require('gulp');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');

// BrowserSync
var browserSync = require('browser-sync');

// Configs
var config = require('../config').images;

gulp.task('images', function () {
    return gulp.src(config.src)
        .pipe(changed(config.dest)) // Ignore unchanged files
        .pipe(imagemin()) // Optimize
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream: true}));
});
