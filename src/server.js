'use strict';

/**
 * Module dependencies.
 */
import debug from 'debug';
debug = debug('react-app-starter');

/**
 * Express app dependencies.
 */
import express, {Router as expressRouter} from 'express';
import cors from 'cors';
import hbs from 'express-handlebars';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';

import chance from 'chance';

/**
 * Setup server app.
 */

let app = express();
import Router from './router';

// disable `X-Powered-By` HTTP header
app.disable('x-powered-by');

// view engine setup
app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());

let generator = chance();

var apiRouter = expressRouter();

apiRouter.get('/users', (req, res) => {
    let count = req.query.count || 10;

    let users = [];

    for (let i = 0; i < count; i++) {
        users.push({
            id: generator.hash({length: 24}),
            name: generator.name()
        });
    }

    res.json(users);
});

apiRouter.get('/user/:id', (req, res) => {
    res.json({
        id: req.params.id,
        name: generator.name(),
        gender: generator.gender(),
        birthday: generator.birthday()
    });
});

app.use('/api', apiRouter);

// React App
app.use(Router.serve);

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
