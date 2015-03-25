'use strict';

// Gulp & plugins
var gulp = require('gulp');

// Nodemon & BrowerSync
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

// Configs
var config = require('../config').nodemon;

var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', ['script:server'], function (callback) {
    var isCalled = false;

    return nodemon(config)
        .on('start', function () {
            if (!isCalled) {
                setTimeout(function () {
                    callback();
                }, BROWSER_SYNC_RELOAD_DELAY);
            }

            isCalled = true;
        }).on('restart', function () {
            setTimeout(function () {
                browserSync.reload({stream: false});
            }, BROWSER_SYNC_RELOAD_DELAY);
        });
});
