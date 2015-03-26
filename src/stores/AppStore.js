// Core
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');

// Libraries
var _ = require('lodash'),
    assign = require('object-assign');

var ALERT_EVENT = 'ALERT';

var _alerts = [];

var AppStore = assign({}, EventEmitter.prototype, {
    addPendingAlert: function (alert) {
        if (_.isObject(alert)
            && (alert.type == null || /^((?:info)|(?:success)|(?:error)|(?:warning))$/i.test(alert.type))
            && alert.message != null && alert.title != null) {
            if (alert.type == null) {
                alert.type = 'info';
            }

            _alerts.push(alert);

            return true;
        } else {
            return false;
        }
    },

    getPendingAlerts: function () {
        return _alerts.splice(0, _alerts.length);
    },

    emitAlert: function () {
        this.emit(ALERT_EVENT);
    },

    /**
     * @param {function} callback
     */
    addAlertListener: function (callback) {
        this.on(ALERT_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeAlertListener: function (callback) {
        this.removeListener(ALERT_EVENT, callback);
    }
});

// Register callback to handle all updates
AppStore.dispatcherToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.ActionTypes.SHOW_ALERT:
            if (AppStore.addPendingAlert(action.alert)) {
                AppStore.emitAlert();
            }
            break;
        default:
            // Do nothing.
    }
});

module.exports = AppStore;
