'use strict';

// Libraries
import async from 'async';
import http from 'superagent';

// Base API class
import Base from './Base';

class User extends Base {
    static get(id, callback) {
        async.waterfall([
            function (asyncCallback) {
                // TODO Refactor this out to a DAO layer.
                http
                    .get('/user/' + id)
                    .use(super.constants.BASE_URL)
                    .timeout(super.constants.TIMEOUT_MS)
                    .end(asyncCallback);
            },

            function (result, asyncCallback) {
                // TODO: Transform the data if necessary.
                // TODO: Otherwise, pass it back to the caller.
                asyncCallback(null, result.body);
            }
        ], callback);
    }

    static getList(page, count, callback) {
        async.waterfall([
            function (asyncCallback) {
                http
                    .get('/users')
                    .query({
                        page: page,
                        count: count
                    })
                    .use(super.constants.BASE_URL)
                    .timeout(super.constants.TIMEOUT_MS)
                    .end(asyncCallback);
            },

            function (result, asyncCallback) {
                // TODO: Transform the data if necessary.
                // TODO: Otherwise, pass it back to the caller.
                asyncCallback(null, result.body);
            }
        ], callback);
    }

    static register(email, name, callback) {
        async.waterfall([
            function (asyncCallback) {
                http
                    .get('/register')
                    .query({
                        email,
                        name
                    })
                    .use(super.constants.BASE_URL)
                    .timeout(super.constants.TIMEOUT_MS)
                    .end(asyncCallback);
            },

            function (result, asyncCallback) {
                // TODO: Transform the data if necessary.
                // TODO: Otherwise, pass it back to the caller.
                asyncCallback(null, result.body);
            }
        ], callback);
    }
}

export default User;
