'use strict';

// Gulp & plugins
var gulp = require('gulp');

// BrowerSync
var nodemon = require('gulp-nodemon');

// Configs
var config = require('../config').nodemon;

gulp.task('nodemon', function () {
    nodemon(config);
});
