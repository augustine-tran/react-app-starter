'use strict';

// Gulp & plugins
var gulp = require('gulp');

// Utilities
var del = require('del');

// Configs
var config = require('../config').clean;

gulp.task('clean', function (callback) {
    del(config.folders, callback);
});
