'use strict';

/**
 * Module dependencies.
 */
import {default as _debug} from 'debug';
let debug = _debug('react-app-starter');

/**
 * Express app dependencies.
 */
import express, {Router as expressRouter} from 'express';
import cors from 'cors';
import hbs from 'express-handlebars';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';

import _ from 'lodash';
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
let _users = [], MAX_USERS = 1000;

for (let i = 0; i <= MAX_USERS; i++) {
    _users.push({
        id: i,
        name: generator.name(),
        gender: generator.gender(),
        birthday: generator.birthday()
    });
}

let apiRouter = expressRouter();

apiRouter.get('/users', (req, res) => {
    let count = (req.query.count == null || req.query.count < 1) ? 10 : req.query.count,
        page = (req.query.page == null || req.query.page < 0) ? 1 : req.query.page,
        startIndex = (page - 1) * count;

    let users = _.slice(_users, startIndex, count);

    users = users.map(user => {
        return {id: user.id, name: user.name};
    });

    res.json(users);
});

apiRouter.get('/user/:id', (req, res) => {
    let id = req.params.id;

    if (id == null || _users.length <= id) {
        res.status(500).send({error: 'Invalid user'});
    } else {
        res.json(_users[id]);
    }
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
