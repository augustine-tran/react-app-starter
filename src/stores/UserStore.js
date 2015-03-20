var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var _data = {
    users: []
};

var UserStore = assign({}, EventEmitter.prototype, {
    getName: function () {
        return _data.name;
    },

    emitChange: function () {
        this.emit(AppConstants.EventTypes.NAME_CHANGE);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(AppConstants.EventTypes.NAME_CHANGE, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(AppConstants.EventTypes.NAME_CHANGE, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
    var name;

    switch (action.actionType) {
        case AppConstants.ActionTypes.USER_LOADED:
            name = action.name == null ? '' : action.name.trim();

            if (name !== '') {
                updateName(name);
            }
            break;

        default:
        // no op
    }
});

module.exports = UserStore;
