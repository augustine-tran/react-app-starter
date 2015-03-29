'use strict';

/**
 * Module dependencies.
 */
import debug from 'debug';
debug = debug('react-app-starter');

/**
 * Express app dependencies.
 */
import express from 'express';
import hbs from 'express-handlebars';
import path from 'path';
//import favicon from 'serve-favicon';
import logger from 'morgan';

/**
 * Setup server app.
 */

let app = express();
import {server as router} from './router';

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
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Get port from environment and store in Express.
 */
let port = process.env.PORT || '8080';
app.set('port', port);

/**
 * Create HTTP server.
 */
let server = app.listen(app.get('port'), () => {
    debug('Express server listening on port ' + server.address().port);
});
