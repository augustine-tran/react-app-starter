'use strict';

import keyMirror from 'keymirror';

export default {

    ActionTypes: keyMirror({
        SHOW_ALERT: null,
        SHOW_INFO_ALERT: null,
        SHOW_ERROR_ALERT: null,
        SHOW_WARNING_ALERT: null,
        SHOW_SUCCESS_ALERT: null,

        CREATE_USER: null,
        CREATE_USER_SUCCESS: null,
        CREATE_USER_ERROR: null,
        READ_USER: null,
        READ_USER_SUCCESS: null,
        READ_USER_ERROR: null,
        UPDATE_USER: null,
        UPDATE_USER_SUCCESS: null,
        UPDATE_USER_ERROR: null,
        DELETE_USER: null,
        DELETE_USER_SUCCESS: null,
        DELETE_USER_ERROR: null
    })

};
