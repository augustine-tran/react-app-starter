/**
 * Module dependencies.
 */
var debug = require('debug')('react-app-starter');

/**
 * Express app dependencies.
 */
var express = require('express');
var hbs  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

/**
 * Setup server app.
 */

var app = express();
var router = require('./routes').router;

// disable `X-Powered-By` HTTP header
app.disable('x-powered-by');

// view engine setup
app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

// TODO: uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '../public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Get port from environment and store in Express.
 */
var port = process.env.PORT || '8080';
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = app.listen(app.get('port'), function () {
    console.log("HELLO!");
    debug('Express server listening on port ' + server.address().port);
});
