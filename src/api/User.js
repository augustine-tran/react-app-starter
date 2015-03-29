'use strict';

// Libraries
import async from 'async';
import http from 'superagent';

// Base API class
import Base from './Base';

export default class User extends Base {
    static get(id, callback) {
        async.waterfall([
            function (asyncCallback) {
                // TODO Refactor this out to a DAO layer.
                http
                    .get('http://localhost:3000/test/user/' + id)
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
