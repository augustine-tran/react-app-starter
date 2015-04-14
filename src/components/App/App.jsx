'use strict';

// React
import React from 'react';

// Libraries
import _ from 'lodash';
import {RouteHandler} from 'react-router';

// Components
import {Button} from 'react-bootstrap';
import GoogleAnalytics from '../Widgets/GoogleAnalytics';
import List from '../Widgets/List';
import UserWidget from '../User/Widget';

// Actions
import AppActions from '../../actions/AppActions';
import UserActions from '../../actions/UserActions';

// Stores
import AppStore from '../../stores/AppStore';
import UserStore from '../../stores/UserStore';

function getInitialState() {
    return {
        users: [],
        page: 1,
        perPageCount: 5
    };
}

function getStateFromStores(parameters) {
    let users = UserStore.getPage(parameters.page, parameters.perPageCount);

    return (users == null) ? null : {
        page: parameters.page,
        perPageCount: parameters.perPageCount,
        users: users
    };
}

function fireActions(parameters, callback) {
    UserActions.getUsers(parameters.page, parameters.perPageCount, callback);
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        this.state = getInitialState();

        /**
         * Event handler for 'change' events coming from the UserStore
         */
        this._onChange = () => {
            let parameters = {
                page: this.state.page,
                perPageCount: this.state.perPageCount
            };

            console.log(`STORE ON CHANGE :: PAGE - ${parameters.page} | PAGE PER COUNT - ${parameters.perPageCount}`);

            let newState = getStateFromStores(parameters);

            if (newState != null) {
                this.setState(newState);
            }
        };

        this._onNextButtonClicked = () => {
            this._onLoadPage(this.state.page + 1);
        };

        this._onPrevButtonClicked = () => {
            this._onLoadPage(this.state.page - 1);
        };

        this._onLoadPage = (page) => {
            if (page >= 1) { // TODO: We can set a max too
                this.setState(_.merge({}, this.state, {isLoadingMoreDetails: true, page: page, perPageCount: this.state.perPageCount}), () => {
                    fireActions({
                        page: this.state.page,
                        perPageCount: this.state.perPageCount
                    });
                }); // Set isLoadingMoreDetails to true
            }
        };

        if (props.data != null) {
            // Server side rendering. Let's use the provided data first.
            _.merge(this.state, props.data);
        }
    }

    componentDidMount() {
        AppStore.addAlertListener(this._onAlert);
        UserStore.addChangeListener(this._onChange);

        fireActions(this.state);
    }

    componentWillUnmount() {
        AppStore.removeAlertListener(this._onAlert);
        UserStore.removeChangeListener(this._onChange);
    }

    /**
     * @return {object}
     */
    render() {
        console.log(`STATE OF USERS :: ${JSON.stringify(this.state.users)}`);
        return (
            <div>
                <h1>Hello</h1>
                <List of={React.createFactory(UserWidget)} dataSet={this.state.users}  />
                <p><button onClick={this._onPrevButtonClicked}>&#8592; Prev</button> or <button onClick={this._onNextButtonClicked}>Next &#8594;</button></p>
                <GoogleAnalytics id="UA-*******-**" />
                <RouteHandler data={this.props.data}/>
            </div>
        );
    }

    /**
     * Event handler for 'change' events coming from the UserStore
     */
    _onAlert() {
        _.forEach(AppStore.getPendingAlerts(), (alertPayload) => {
            console.log(`${alertPayload.type.toUpperCase()} :: ${alertPayload.title} - ${alertPayload.message}`);
            //window.alert(`${alertPayload.type.toUpperCase()} :: ${alertPayload.title} - ${alertPayload.message}`);
        });
    }

    /**
     * Static method to trigger data actions for server-side rendering.
     *
     * @param routerState
     * @returns {*}
     */
    static fetchData(routeState, callback) {
        // TODO: Get state from router params
        let state = getInitialState();

        fireActions(state, callback);
    }
}

export default App;
