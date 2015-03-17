'use strict';

// Gulp & plugins
var gulp        = require('gulp'),
    watch       = require('gulp-watch');

// BrowerSync
var browserSync = require('browser-sync');

// Configs
var config      = require('../config');

gulp.task('watch', ['browserSync'], function () {
    watch(config.sass.src, ['sass']);
    watch(config.scripts.src, ['script']);
    watch(config.images.src, ['images']);
    watch(config.fonts.src, ['fonts']);
    watch(config.markup.src, ['markup']);
});
