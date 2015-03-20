// Libraries
var async = require('async');

// App Dispatcher and constants
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

    /**
     * Load user from API.
     * @param id
     */
    loadUser: function (id) {
        var user = {};

        AppDispatcher.dispatch({
            actionType: AppConstants.ActionTypes.USER_LOADED,
            user: user
        });
    }
};

module.exports = AppActions;
