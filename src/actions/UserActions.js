'use strict';

// Libraries
import _ from 'lodash';

// Dispatcher and constants
import alt from '../alt';

// Actions
import AppActions from './AppActions';

// API
import UserAPI from '../api/User';

class UserActions {
    getUser(parameters) {
        let { id, fields, callback } = parameters;

        let payload = {
            id,
            fields,
            getData: UserAPI.get(id),
            onSuccess: data => {
                // TODO: You can add in hooks here to do something with the transformed data.
            },
            onError: error => {
                AppActions.showAlert({error});
            },
            onFinish: (callback != null && _.isFunction(callback)) ? callback : undefined
        };

        this.dispatch(payload);
    }

    getUsers(parameters) {
        let { page, perPageCount, fields, callback } = parameters;

        let payload = {
            page,
            perPageCount,
            fields,
            getData: UserAPI.getPage(page, perPageCount),
            onSuccess: data => {
                // TODO: You can add in hooks here to do something with the transformed data.
            },
            onError: error => {
                // TODO: You can add in hooks here to do something when an error occurs.
                AppActions.showAlert({error});
            },
            onFinish: (callback != null && _.isFunction(callback)) ? callback : undefined
        };

        this.dispatch(payload);
    }
}

export default alt.createActions(UserActions);
