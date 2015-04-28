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
        this.bindAction(UserActions.getUsers, this.onGetUsers);

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

    onGetUser(payload) {
        let {
            id,
            fields,
            getData,
            onSuccess,
            onError,
            onFinish
        } = payload;

        let successCallback = user => {
            if (user != null) {
                this.set(user);

                if (onSuccess != null && _.isFunction(onSuccess)) {
                    console.log(`GET USER ON SUCCESS! DATA :: ${JSON.stringify(user)}`);
                    onSuccess(user);
                }

                if (onFinish != null && _.isFunction(onFinish)) {
                    console.log(`GET USER ON FINISH! DATA :: ${JSON.stringify(user)}`);
                    onFinish(null, user);
                }
            }
        };

        let errorCallback = error => {
            if (onError != null && _.isFunction(onError)) {
                console.log(`GET USER ON ERROR! ERROR :: ${JSON.stringify(error)}`);
                onError(error);
            }

            if (onFinish != null && _.isFunction(onFinish)) {
                console.log(`GET USER ON FINISH! ERROR :: ${JSON.stringify(error)}`);
                onFinish(error);
            }
        };

        if (!this.has(id, fields)) {
            getData
                .then(successCallback)
                .catch(errorCallback);
        } else {
            successCallback(this.get(id));
        }
    }

    onGetUsers(payload) {
        let {
            page,
            perPageCount,
            fields,
            getData,
            onSuccess,
            onError,
            onFinish
        } = payload;

        let successCallback = users => {
            console.log(`GET USERS SUCCESS CALLBACK WITH :: ${JSON.stringify(users)}`);

            if (users != null) {
                this.setList(users, (page - 1) * perPageCount);

                if (onSuccess != null && _.isFunction(onSuccess)) {
                    console.log(`GET USER ON SUCCESS! DATA :: ${JSON.stringify(users)}`);
                    onSuccess(users);
                }

                if (onFinish != null && _.isFunction(onFinish)) {
                    console.log(`GET USER ON FINISH! DATA :: ${JSON.stringify(users)}`);
                    onFinish(null, users);
                }
            } else {
                console.log(`DID NOT VALIDATE`);
            }
        };

        let errorCallback = error => {
            if (onError != null && _.isFunction(onError)) {
                console.log(`GET USER ON ERROR! ERROR :: ${JSON.stringify(error)}`);
                onError(error);
            }

            if (onFinish != null && _.isFunction(onFinish)) {
                console.log(`GET USER ON FINISH! ERROR :: ${JSON.stringify(error)}`);
                onFinish(error);
            }
        };

        if (!this.hasPage(page, perPageCount, fields)) {
            getData
                .then(successCallback)
                .catch(errorCallback);
        } else {
            successCallback(this.getPage(page, perPageCount));
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

    get(id, fields) {
        let state = this.getState();

        return state.users[id];
    }

    getList(startIndex, count) {
        if (count == null && startIndex != null) {
            count = startIndex;
            startIndex = 0;
        }

        if (startIndex >= 0 && count > 1) {
            let endIndex = startIndex + count;
            let state = this.getState();
            let userList = _.slice(state.userListOrder, startIndex, endIndex);

            return _.map(userList, function (id) {
                return state.users[id];
            });
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
                this.users[user.id] = user; // TODO We might want to do a merge here? In case the API returns data differently
                this.userListOrder[i] = user.id;
                ++i;
            }, this);

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
    //         }, this);
    //     }
    // }
}

export default alt.createStore(UserStore, 'UserStore', true);
