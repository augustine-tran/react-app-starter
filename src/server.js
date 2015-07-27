'use strict';

/**
 * Module dependencies.
 */
import {default as _debug} from 'debug';
let debug = _debug('react-app-starter');

/**
 * Express app dependencies.
 */
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {Router as expressRouter} from 'express';
import hbs from 'express-handlebars';
import logger from 'morgan';
import path from 'path';
import favicon from 'serve-favicon';

import async from 'async';
import chance from 'chance';
import _ from 'lodash';
import http from 'superagent';
import uuid from 'uuid';
import validator from 'validator';

import appConfig from './configs/app';
import corsConfig from './configs/cors';

import corsService from './services/cors';
import errorService from './services/error';
import redisService from './services/redis';

let redisClient = redisService.connect();

/**
 * Setup server app.
 */

let app = express();

let env = app.get('env').toLowerCase();

import Router from './router';

// disable `X-Powered-By` HTTP header
app.disable('x-powered-by');

// view engine setup
app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

var corsOptions = corsConfig.options;

console.log('CORS SERVICE :: Operating in %s mode.', corsConfig.mode);

corsOptions.origin = function (origin, callback) {
    if (origin == null) {
        return callback(null, (false || env === 'development'));
    }

    var originIsWhitelisted = false;

    if (env === 'development') {
        // If we are in development env, we'll match localhost too.
        originIsWhitelisted = /^http[s]?:\/\/(?:[0-9a-zA-Z-]+\.)?localhost(?::\d+)*(?:\/.*)*$/i.test(origin);
    }

    // We'll allow any requests from *.qanvast.com in relaxed mode!
    // For strict mode, we'll only allow requests from URLs specified in config.
    if (originIsWhitelisted === false) {
        if (corsConfig.mode === 'relaxed') {
            originIsWhitelisted = /^http[s]?:\/\/(?:[0-9a-zA-Z-]+\.)?qanvast\.com(?:\/.*)*$/i.test(origin);
        } else {
            originIsWhitelisted = corsConfig.whitelist.indexOf(origin) !== -1;
        }
    }

    var error = null;

    if (originIsWhitelisted === false) {
        error = errorService.throwForbiddenError();
    }

    callback(error, originIsWhitelisted);
};

app.options('*', corsService(corsOptions));
app.use(corsService(corsOptions));

app.use(bodyParser.json());

let generator = chance();
const MAX_USERS = 1000;
let _users = [];

for (let i = 0; i <= MAX_USERS; i++) {
    _users.push({
        id: i,
        name: generator.name(),
        gender: generator.gender(),
        birthday: generator.birthday(),
        address: {
            line1: generator.address(),
            line2: generator.city()
        }
    });
}

let apiRouter = expressRouter();

apiRouter.get('/users', (req, res) => {
    let perPageCount = (req.query.per_page_count == null || req.query.per_page_count < 1) ? 10 : parseInt(req.query.per_page_count),
        page = (req.query.page == null || req.query.page < 0) ? 1 : parseInt(req.query.page),
        startIndex = (page - 1) * perPageCount,
        endIndex = startIndex + perPageCount;

    let users = _.slice(_users, startIndex, endIndex);

    users = users.map(user => {
        /**
         * TODO: Even numbered users will contain the whole object, while odd numbered users will only contain ID and name.
         * TODO: Remove this if you're not trying to learn React.
         */
        if (user.id % 2 === 1) {
            return user;
        } else {
            return {id: user.id, name: user.name};
        }
    });

    let response = {
        page: page,
        totalCount: MAX_USERS,
        perPageCount: perPageCount,
        data: users
    };

    res.json(response);
});

apiRouter.get('/user/:id', (req, res) => {
    let id = req.params.id;

    if (id == null || _users.length <= id) {
        res.status(500).send({error: 'Invalid user'});
    } else {
        res.json(_users[id]);
    }
});

let proxyRegex = /(?:\/proxy)(\S*)/;

apiRouter.post('/proxy/*', (req, res) => {
    //TODO: Check for cookies, and perform other necessary magicks
    let path = proxyRegex.exec(req.url)[1];

    //TODO: Refactor out?
    async.waterfall([
        function(callback) {
            http
                .post(appConfig.apiUrl + '' + path)
                .type('json')
                .send(req.body)
                .timeout(appConfig.timeoutMs)
                .end(callback);
        }, function(result, callback) {
            callback(null, result.body);
        }
    ], (error, data) => {
        if (!error) {
            if (data.tokens) {
                let sessionId = uuid.v4();
                redisClient.hmset(sessionId, data.tokens);
                data.tokens = undefined;
                res.cookie('sessionId', sessionId);
            }
            res.send(data);
        } else {
            res.send(error);
        }
    });
});

apiRouter.get('/proxy/*', (req, res) => {
    //TODO: Check for cookies, and perform other necessary magicks
    console.log(req.url);
    console.log(req.headers);
    console.log(req.params);
    res.send({msg: 'GEEP'});
});

app.use('/api', apiRouter);

// React App
app.use(Router.getData, Router.serve);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Get port from environment and store in Express.
 */
let port = process.env.PORT || '8000';
app.set('port', port);

/**
 * Create HTTP server.
 */
let server = app.listen(app.get('port'), () => {
    debug('Express server listening on port ' + server.address().port);
});
