var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

require('node-jsx').install({extension: '.jsx'});
var router = require('./src/routes').router;

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(express.static(path.join(__dirname, 'public')));
app.use('*', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
