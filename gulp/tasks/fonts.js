'use strict';

// Gulp & plugins
var gulp = require('gulp');

// Configs
var config = require('../config').fonts;

gulp.task('fonts', function () {
    var blobs = require('main-bower-files')({filter: config.filter}).concat(config.src);

    return gulp.src(blobs)
        .pipe(gulp.dest(config.dest));
});
