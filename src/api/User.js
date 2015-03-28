'use strict';

// Libraries
import async from 'async';
import http from 'superagent';

export default {
    get(id, callback) {
        async.waterfall([
            function (asyncCallback) {
                // TODO Refactor this out to a DAO layer.
                http
                    .get('http://localhost:3000/test/user/' + id)
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
