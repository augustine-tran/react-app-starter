'use strict';

// Core
import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import AppConstants from '../constants/AppConstants';

// Libraries
import _ from 'lodash';
import assign from 'object-assign';

const ALERT_EVENT = 'ALERT';

let _alerts = [];

let AppStore = assign({}, EventEmitter.prototype, {
    addPendingAlert (alert) {
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

    getPendingAlerts () {
        return _alerts.splice(0, _alerts.length);
    },

    emitAlert () {
        this.emit(ALERT_EVENT);
    },

    /**
     * @param {function} callback
     */
    addAlertListener (callback) {
        this.on(ALERT_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeAlertListener (callback) {
        this.removeListener(ALERT_EVENT, callback);
    }
});

// Register callback to handle all updates
AppStore.dispatcherToken = AppDispatcher.register(action => {
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

export default AppStore;
