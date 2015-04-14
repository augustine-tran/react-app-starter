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

    static getPage(page, perPageCount, callback) {
        async.waterfall([
            function (asyncCallback) {
                http
                    .get('/users')
                    .query({
                        page: page,
                        'per_page_count': perPageCount
                    })
                    .use(super.constants.BASE_URL)
                    .timeout(super.constants.TIMEOUT_MS)
                    .end(asyncCallback);
            },

            function (result, asyncCallback) {
                // TODO: Transform the data if necessary.
                // TODO: Otherwise, pass it back to the caller.
                let response = result.body;

                if (response.page === page && response.perPageCount === perPageCount && response.data != null) {
                    asyncCallback(null, response.data);
                } else {
                    asyncCallback(new Error('Invalid response!'));
                }
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
