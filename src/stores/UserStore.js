'use strict';

// Core
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');

// Libraries
var _ = require('lodash'),
    assign = require('object-assign');

var CHANGE_EVENT = 'CHANGE';

var _users = {};

var _userListOrder = [];

var UserStore = assign({}, EventEmitter.prototype, {
    get: function (id) {
        return _users[id];
    },

    getList: function (startIndex, count) {
        if (count == null && startIndex != null) {
            count = startIndex;
            startIndex = 0;
        }

        if (startIndex > 0 && count > 1) {
            return _.slice(_userListOrder, startIndex, count);
        }

        return null;
    },

    getPage: function (page, count) {
        return this.getList((page - 1) * count, count);
    },

    set: function (user) {
        if (user != null) {
            _users[user._id] = user;

            return true; // User was successfully updated.
        } else {
            return false;
        }
    },

    setList: function (userList, startIndex) {
        var i = startIndex;

        if (_.isArray(userList)) {
            _.forEach(userList, function (user) {
                _users[user._id] = user;
                _userListOrder[i] = user._id;
                ++i;
            });
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
UserStore.dispatcherToken = AppDispatcher.register(function (action) {
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
