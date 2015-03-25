// Libraries
var assign = require('object-assign'),
    async = require('async'),
    http = require('superagent');

module.exports.get = function (id, callback) {
    async.waterfall([
        function (callback) {
            // TODO Refactor this out to a DAO layer.
            http
                .get('http://localhost:3000/test/user/' + id)
                .end(callback);
        },

        function (result, callback) {
            // TODO: Transform the data if necessary.
            // TODO: Otherwise, pass it back to the caller.
            callback(null, result.body);
        }
    ], callback);
};
