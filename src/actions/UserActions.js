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
    readUser (id, callback) {
        UserAPI.get(id, (error, user) =>{
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
    }
}
