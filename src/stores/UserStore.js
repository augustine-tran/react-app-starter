'use strict';

// Core
import AppDispatcher from '../dispatcher/AppDispatcher';
import EventEmitter from 'eventemitter3';
import AppConstants from '../constants/AppConstants';

// Libraries
import _ from 'lodash';
import assign from 'object-assign';
import objectHasKey from '../utilities/objectHasKey';

const CHANGE_EVENT = 'CHANGE';

// Data
let _users = {};
let _userListOrder = []; // TODO: If user list is to be filtered, we can have a new order array. e.g. _userSortedListOrder or _userFilteredListOrder
//let _userSortedListOrder = [];

let UserStore = assign({}, EventEmitter.prototype, {

    has(id, fields) {
        let user = _users[id];

        if (user != null) {
            if (_.isArray(fields)) {
                let hasAllRequiredFields = true;
                for (let field of fields) {
                    if (!objectHasKey(user, field)) {
                        hasAllRequiredFields = false;
                        break;
                    }
                }

                return hasAllRequiredFields;
            } else {
                return true;
            }
        } else {
            return true;
        }

        return (_users[id] != null);
    },

    hasList(startIndex, count, fields) {
        if (count == null && startIndex != null) {
            count = startIndex;
            startIndex = 0;
        }

        if (startIndex > 0 && count > 1) {
            let lastIndex = startIndex + count,
                listElementsExists = true;

            for (let i = startIndex; i < lastIndex; ++i) {
                let userId = _userListOrder[i];
                if (userId == null || !this.has(userId, fields)) {
                    listElementsExists = false;
                    break;
                }
            }

            return listElementsExists;
        } else {
            return false;
        }
    },

    hasPage(page, count, fields) {
        return this.hasList((page - 1) * count, count, fields);
    },

    get(id) {
        return _users[id];
    },

    getList(startIndex, count) {
        if (count == null && startIndex != null) {
            count = startIndex;
            startIndex = 0;
        }

        if (startIndex > 0 && count > 1) {
            let endIndex = startIndex + count;

            let userList = _.slice(_userListOrder, startIndex, endIndex);

            userList = _.map(userList, function (id) {
                return _users[id];
            });

            return userList;
        }

        return null;
    },

    getPage(page, count) {
        return this.getList((page - 1) * count, count);
    },

    set(user) {
        if (user != null) {
            _users[user.id] = user; // TODO We might want to do a merge here? In case the API returns data differently

            return true; // User was successfully updated.
        } else {
            return false;
        }
    },

    setList(userList, startIndex) {
        let i = startIndex;

        if (_.isArray(userList)) {
            _.forEach(userList, function (user) {
                _users[user.id] = user; // TODO We might want to do a merge here? In case the API returns data differently
                _userListOrder[i] = user.id;
                ++i;
            });

            return true;
        } else {
            return false;
        }
    },

    // TODO If we need to manage a separate
    // setSortedList(userList, startIndex) {
    //     let i = startIndex;
    //
    //     if (_.isArray(userList)) {
    //         _.forEach(userList, function (user) {
    //             _users[user.id] = user; // TODO We might want to do a merge here? In case the API returns data differently
    //             _userSortedListOrder[i] = user.id;
    //             ++i;
    //         });
    //     }
    // },

    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
UserStore.dispatcherToken = AppDispatcher.register(action => {
    switch (action.actionType) {
        case AppConstants.ActionTypes.READ_USER_SUCCESS:
            if (UserStore.set(action.user)) {
                UserStore.emitChange();
            }
            break;

        case AppConstants.ActionTypes.READ_USER_ERROR:
            // TODO: Shucks! Let's handle this error.
            break;

        case AppConstants.ActionTypes.READ_USER_LIST_SUCCESS:
            if (UserStore.setList(action.users, (action.page - 1) * action.perPageCount)) {
                UserStore.emitChange();
            }
            break;

        case AppConstants.ActionTypes.READ_USER_LIST_ERROR:
            // TODO: Shucks! Let's handle this error.
            break;

        default:
            // Do nothing.
    }
});

export default UserStore;
