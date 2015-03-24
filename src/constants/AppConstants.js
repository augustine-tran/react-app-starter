var keyMirror = require('keymirror');

module.exports = {

    ActionTypes: keyMirror({
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
