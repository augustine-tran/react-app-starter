'use strict';

// Gulp & plugins
var gulp = require('gulp');

// Configs
var config = require('../config').fonts;

gulp.task('fonts', function () {
    return gulp.src(require('main-bower-files')({
        filter: config.filter
    }).concat(config.src))
        .pipe(gulp.dest(config.dest));
});
