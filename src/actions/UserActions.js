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
            var actionPayload = {
                user: user
            };

            if (callback != null && _.isFunction(callback)) {
                callback(error, actionPayload);
            }

            if (!error) {
                actionPayload.actionType = AppConstants.ActionTypes.READ_USER_SUCCESS;
            } else {
                actionPayload.actionType = AppConstants.ActionTypes.READ_USER_ERROR;
            }

            AppDispatcher.dispatch(actionPayload);
        });
    }
};

module.exports = UserActions;
