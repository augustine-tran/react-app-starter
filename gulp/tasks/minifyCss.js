'use strict';

// Gulp & plugins
var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var size = require('gulp-filesize');

// Configs
var config = require('../config').production;

gulp.task('minifyCss', ['sass'], function () {
    return gulp.src(config.cssSrc)
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(gulp.dest(config.dest))
        .pipe(size());
})
