'use strict';

// Libraries
//import async from 'async';

// App Dispatcher and constants
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

let AppActions = {
    /**
     * TODO: Add in generic app actions.
     */
    showAlert (type, message, title) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ActionTypes.SHOW_ALERT,
            alert: {
                type: type,
                message: message,
                title: title
            }
        });
    }
};

export default AppActions;
