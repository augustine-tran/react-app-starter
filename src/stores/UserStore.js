'use strict';

// Core
import alt from '../alt';
import EventEmitter from 'eventemitter3';

// Actions
import UserActions from '../actions/UserActions';

// Dependent Stores
import AppStore from './AppStore';

// Libraries
import _ from 'lodash';
import assign from 'object-assign';
import objectHasKey from '../utilities/objectHasKey';

class UserStore {
    constructor () {
        this.users = {};
        this.userListOrder = []; // TODO: If user list is to be filtered, we can have a new order array. e.g. userSortedListOrder or userFilteredListOrder
        this.userSortedListOrder = [];

        this.bindAction(UserActions.getUser, this.onGetUser);

        this.exportPublicMethods({
            has: this.has,
            hasList: this.hasList,
            hasPage: this.hasPage,
            get: this.get,
            getList: this.getList,
            getPage: this.getPage,
            set: this.set,
            setList: this.setList
        });
    }

    onGetUser(data) {
        if (data.user != null) {
            this.set(data.user);
        }
    }

    has(id, fields) {
        let user = this.users[id];

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
            return false;
        }
    }

    hasList(startIndex, count, fields) {
        if (count == null && startIndex != null) {
            count = startIndex;
            startIndex = 0;
        }

        if (startIndex >= 0 && count > 1) {
            let lastIndex = startIndex + count,
                listElementsExists = true;

            for (let i = startIndex; i < lastIndex; ++i) {
                let userId = this.userListOrder[i];
                if (userId == null || !this.has(userId, fields)) {
                    listElementsExists = false;
                    break;
                }
            }

            return listElementsExists;
        } else {
            return false;
        }
    }

    hasPage(page, count, fields) {
        return this.hasList((page - 1) * count, count, fields);
    }

    get(id) {
        return this.users[id];
    }

    getList(startIndex, count) {
        if (count == null && startIndex != null) {
            count = startIndex;
            startIndex = 0;
        }

        if (startIndex >= 0 && count > 1) {
            let endIndex = startIndex + count;

            let userList = _.slice(this.userListOrder, startIndex, endIndex);

            userList = _.map(userList, function (id) {
                return this.users[id];
            });

            return userList;
        }

        return null;
    }

    getPage(page, count) {
        return this.getList((page - 1) * count, count);
    }

    set(user) {
        if (user != null) {
            //let currentUserObject = this.users[user.id];
            //
            //if (currentUserObject != null) {
            //    user = _.merge({}, currentUserObject, user);
            //}

            this.users[user.id] = user; // TODO We might want to do a merge here? In case the API returns data differently

            return true; // User was successfully updated.
        } else {
            return false;
        }
    }

    setList(userList, startIndex) {
        let i = startIndex;

        if (_.isArray(userList)) {
            _.forEach(userList, function (user) {
                //let currentUserObject = this.users[user.id];
                //
                //if (currentUserObject != null) {
                //    // Merge all existing user properties
                //    user = _.merge({}, currentUserObject, user);
                //}

                this.users[user.id] = user; // TODO We might want to do a merge here? In case the API returns data differently
                this.userListOrder[i] = user.id;
                ++i;
            });

            return true;
        } else {
            return false;
        }
    }

    // TODO If we need to manage a separate sorted list
    // setSortedList(userList, startIndex) {
    //     let i = startIndex;
    //
    //     if (_.isArray(userList)) {
    //         _.forEach(userList, function (user) {
    //             this.users[user.id] = user; // TODO We might want to do a merge here? In case the API returns data differently
    //             this.userSortedListOrder[i] = user.id;
    //             ++i;
    //         });
    //     }
    // }
}

export default alt.createStore(UserStore, 'UserStore', true);
