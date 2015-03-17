'use strict';

// Gulp & plugins
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');

// BrowerSync
var browserSync = require('browser-sync');

// Utilities
var handleErrors = require('../util/handleErrors');

// Configs
var config = require('../config').sass;

gulp.task('sass', function () {
    return gulp.src(config.src)
        .pipe(sass(config.settings))
        .on('error', handleErrors)
        .pipe(autoprefixer({browsers: ['last 2 version']}))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream: true}));
});
