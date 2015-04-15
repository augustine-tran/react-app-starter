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


class App extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.
    }

    componentDidMount() {
        AppStore.addAlertListener(this._onAlert);
    }

    componentWillUnmount() {
        AppStore.removeAlertListener(this._onAlert);
    }

    /**
     * @return {object}
     */
    render() {
        return (
            <div>
                <h1>App</h1>
                <br /><hr /><br />
                <RouteHandler data={this.props.data} />
                <br /><hr /><br />
                <GoogleAnalytics id="UA-*******-**" />
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
}

export default App;
