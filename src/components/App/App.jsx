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

function getStateFromStores(previousState) {
    let users = UserStore.getPage(previousState.page, previousState.count);

    return (users == null) ? null : {
        users: users
    };
}

function fireActions(state, callback) {
    UserActions.getUsers(state.page, state.count, callback);
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.

        this.state = {
            users: [],
            page: 1,
            count: 100
        };

        /**
         * Event handler for 'change' events coming from the UserStore
         */
        this._onChange = () => {
            let newState = getStateFromStores(this.state);

            if (newState != null) {
                this.setState(getStateFromStores(this.state));
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
        return (
            <div>
                <h1>Hello</h1>
                <List of={React.createFactory(UserWidget)} dataSet={this.state.users}  />
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
     * @param params
     * @returns {*}
     */
    static fetchData(state, callback) {
        fireActions(state, callback);
    }
}

export default App;
