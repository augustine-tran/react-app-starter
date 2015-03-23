// Libraries
var _ = require('lodash'),
    async = require('async');

// App Dispatcher and constants
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

// API
var UserAPI = require('../api/user');

var UserActions = {
    /**
     * Read user from API.
     * @param id
     */
    readUser: function (id, callback) {
        UserAPI.get(id, function (error, user) {
            async.parallel([
                function (done) {
                    if (callback != null && _.isFunction(callback)) {
                        callback(error, user);
                    }

                    done();
                },

                function (done) {
                    if (!error) {
                        AppDispatcher.dispatch({
                            actionType: AppConstants.EventTypes.USER_READ_SUCCESS,
                            user: user
                        });
                    } else {
                        AppDispatcher.dispatch({
                            actionType: AppConstants.EventTypes.USER_READ_ERROR,
                            user: user
                        });
                    }

                    done();
                }
            ]);
        });
    }
};

module.exports = UserActions;
