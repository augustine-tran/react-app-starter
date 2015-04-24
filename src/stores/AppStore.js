'use strict';

// Core
import alt from '../alt';
import EventEmitter from 'eventemitter3';

// Actions
import AppActions from '../actions/AppActions';

// Libraries
import _ from 'lodash';
import assign from 'object-assign';

class AppStore {
    constructor () {
        this.alerts = [];

        this.bindAction(AppActions.showAlert, this.onAddPendingAlert);

        this.exportPublicMethods({
            addPendingAlert: this.addPendingAlert,
            getPendingAlerts: this.getPendingAlerts
        });
    }

    onAddPendingAlert (data) {
        if (data.error != null) {
            this.addPendingAlert({
                type: 'error',
                title: 'Oops!',
                message: data.error.message
            });
        }
    }

    addPendingAlert (alert) {
        if (_.isObject(alert)
            && (alert.type == null || /^((?:info)|(?:success)|(?:error)|(?:warning))$/i.test(alert.type))
            && alert.message != null && alert.title != null) {
            if (alert.type == null) {
                alert.type = 'info';
            }

            this.alerts.push(alert);

            return true;
        } else {
            return false;
        }
    }

    getPendingAlerts () {
        return this.alerts.splice(0, this.alerts.length);
    }
}

export default alt.createStore(AppStore, 'AppStore', false);
