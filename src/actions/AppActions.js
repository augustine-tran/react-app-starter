// Libraries
var async = require('async');

// App Dispatcher and constants
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {
    /**
     * TODO: Add in generic app actions.
     */
    showAlert: function (type, message, title) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ActionTypes.SHOW_ALERT,
            alert: {
                type: type,
                message: message,
                title: title
            }
        });
    }
};

module.exports = AppActions;
