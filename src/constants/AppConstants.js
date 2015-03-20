var keyMirror = require('keymirror');

module.exports = {

    ActionTypes: keyMirror({
        CREATE_USER: null,
        READ_USER: null,
        UPDATE_USER: null,
        DELETE_USER: null
    }),

    EventTypes: keyMirror({
        USER_CREATE_SUCCESS: null,
        USER_CREATE_ERROR: null,
        USER_READ_SUCCESS: null,
        USER_READ_ERROR: null,
        USER_UPDATE_SUCCESS: null,
        USER_UPDATE_ERROR: null,
        USER_DELETE_SUCCESS: null,
        USER_DELETE_ERROR: null
    })

};
