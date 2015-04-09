'use strict';

// Libraries
import _ from 'lodash';
//import async from 'async';

// App Dispatcher and constants
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

// API
import UserAPI from '../api/user';

export default {
    /**
     * Read user from API.
     * @param id
     */
    getUser(id, callback) {
        UserAPI.get(id, (error, user) => {
            let actionPayload = {
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
    },

    getUsers(page, count, callback) {
        UserAPI.getList(page, count, (error, users) => {
            let actionPayload = {
                users: users,
                page: page,
                count: count
            };

            if (callback != null && _.isFunction(callback)) {
                callback(error, actionPayload);
            }

            if (!error) {
                actionPayload.actionType = AppConstants.ActionTypes.READ_USER_LIST_SUCCESS;
            } else {
                actionPayload.actionType = AppConstants.ActionTypes.READ_USER_LIST_ERROR;
            }

            AppDispatcher.dispatch(actionPayload);
        });
    }
}
