// Core
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');

// Libraries
var assign = require('object-assign');

// Components
//var ReactToastr = require("react-toastr");

var CHANGE_EVENT = 'CHANGE';

var _user = {};

var UserStore = assign({}, EventEmitter.prototype, {
    get: function () {
        return _user;
    },

    set: function (user) {
        if (user != null) {
            _user = user;

            return true; // User was successfully updated.
        } else {
            return false;
        }
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.ActionTypes.READ_USER_SUCCESS:
            if (UserStore.set(action.user)) {
                UserStore.emitChange();
            }
            break;

        case AppConstants.ActionTypes.READ_USER_ERROR:
            // TODO: Shucks! Let's handle this error.
            break;

        default:
            // Do nothing.
    }
});

module.exports = UserStore;
