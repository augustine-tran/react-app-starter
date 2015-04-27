'use strict';

// Libraries
import _ from 'lodash';

// Dispatcher and constants
import alt from '../alt';

// Actions
import AppActions from './AppActions';

// API
import UserAPI from '../api/user';

// Stores
//import UserStore from '../stores/UserStore';

class UserActions {
    /**
     * Read user from API.
     * @param id
     */
    getUser(parameters) {
        let { id, fields, callback } = parameters;

        let responseCallback = (error, user) => {
            let data = {
                user
            };

            if (callback != null && _.isFunction(callback)) {
                callback(error);
            }

            if (!error) {
                console.log(`GET USER ACTION :: DISPATCHING DATA :: ${JSON.stringify(data)}`);

                this.dispatch(data);
            } else {
                AppActions.showAlert({error});
            }
        };

        // TODO UserAPI should be refactored into UserUtil and it will check if UserStore has requested user before calling API.
        //if (UserStore.has(id, fields)) {
        //    responseCallback(null, UserStore.get(id));
        //} else {
        //    UserAPI.get(id, responseCallback);
        //}
        UserAPI.get(id, responseCallback);
    }

    getUsers(parameters) {
        let { page, perPageCount, fields, callback } = parameters;

        let responseCallback = (error, users) => {
            let data = {
                users,
                page,
                perPageCount
            };

            if (callback != null && _.isFunction(callback)) {
                callback(error);
            }

            if (!error) {
                console.log(`GET USERS ACTION :: DISPATCHING DATA :: ${JSON.stringify(data)}`);

                this.dispatch(data);
            } else {
                console.log(`ERROR! ${JSON.stringify(error)}`);
                AppActions.showAlert({error});
            }
        };

        // TODO UserAPI should be refactored into UserUtil and it will check if UserStore has requested users before calling API.
        //if (UserStore.hasPage(page, perPageCount)) {
        //    responseCallback(null, UserStore.getPage(page, perPageCount));
        //} else {
        //    UserAPI.getPage(page, perPageCount, responseCallback);
        //}

        UserAPI.getPage(page, perPageCount, responseCallback);
    }
}

export default alt.createActions(UserActions);
