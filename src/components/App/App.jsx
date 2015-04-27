'use strict';

// React
import React from 'react';

// Libraries
import _ from 'lodash';
import {RouteHandler} from 'react-router';

// Components
import {Button} from 'react-bootstrap';
import GoogleAnalytics from 'react-ga';
import List from '../Widgets/List';

// Stores
import AppStore from '../../stores/AppStore';

class App extends React.Component {
    constructor(props, context) {
        super(props, context); // NOTE: IntelliJ lints this as invalid. Ignore warning.
    }

    componentDidMount() {
        AppStore.listen(this.onAlert);
    }

    componentWillUnmount() {
        AppStore.unlisten(this.onAlert);
    }

    /**
     * @return {object}
     */
    render() {
        return (
            <div>
                <h1>App</h1>
                <hr />
                <RouteHandler {...this.props}/>
            </div>
        );
    }

    /**
     * Event handler for 'change' events coming from the UserStore
     */
    onAlert() {
        _.forEach(AppStore.getPendingAlerts(), (alertPayload) => {
            console.log(`${alertPayload.type.toUpperCase()} :: ${alertPayload.title} - ${alertPayload.message}`);
            window.alert(`${alertPayload.type.toUpperCase()} :: ${alertPayload.title} - ${alertPayload.message}`);
        });
    }
}

export default App;
