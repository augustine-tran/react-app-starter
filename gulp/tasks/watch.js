'use strict';

// Gulp & plugins
var gulp = require('gulp');

// BrowerSync
var browserSync = require('browser-sync');

// Configs
var config = require('../config');

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.sass.src, ['sass']);
    gulp.watch(config.scripts.src, ['script']);
    gulp.watch(config.templates.src, ['templates']);
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.fonts.src, ['fonts']);
    gulp.watch(config.markup.src, ['markup']);
});
