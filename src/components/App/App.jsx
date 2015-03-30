'use strict';

// React
import React from 'react';

// Libraries
import _ from 'lodash';
import {Link, RouteHandler} from 'react-router';

// Components
import GoogleAnalytics from '../Widgets/GoogleAnalytics';

// Stores
import AppStore from '../../stores/AppStore';

class App extends React.Component {
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
                <h1>Hello</h1>
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
}

export default App;
