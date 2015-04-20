'use strict';

// Libraries
import _ from 'lodash';
//import async from 'async';

// App Dispatcher and constants
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

// API
import UserAPI from '../api/user';
import UserStore from '../stores/UserStore';

export default {
    /**
     * Read user from API.
     * @param id
     */
    getUser(id, fields, callback) {
        if (fields != null && callback == null && _.isFunction(fields)) {
            callback = fields;
            fields = undefined;
        }

        let responseCallback = (error, user) => {
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
        };

        if (UserStore.has(id, fields)) {
            responseCallback(null, UserStore.get(id));
        } else {
            UserAPI.get(id, responseCallback);
        }
    },

    getUsers(page, perPageCount, fields, callback) {
        if (fields != null && callback == null && _.isFunction(fields)) {
            callback = fields;
            fields = undefined;
        }

        let responseCallback = (error, users) => {
            let actionPayload = {
                users: users,
                page: page,
                perPageCount: perPageCount
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
        };

        if (UserStore.hasPage(page, perPageCount)) {
            responseCallback(null, UserStore.getPage(page, perPageCount));
        } else {
            UserAPI.getPage(page, perPageCount, responseCallback);
        }
    }
}
