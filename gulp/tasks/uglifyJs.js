'use strict';

// Gulp & plugins
var gulp = require('gulp');
var size = require('gulp-filesize');
var uglify = require('gulp-uglify');

// Configs
var config = require('../config').production.script;

gulp.task('uglifyJs', ['script'], function () {
    return gulp.src(config.src)
        .pipe(uglify())
        .pipe(gulp.dest(config.dest))
        .pipe(size());
});
