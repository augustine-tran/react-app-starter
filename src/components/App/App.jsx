'use strict';

// Libraries
var _ = require('lodash');

// React
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

// Components


// Stores
var AppStore = require('../../stores/AppStore');

var App = React.createClass({
    addAlert: function (type, message, title) {
        window.alert(type.toUpperCase() + " :: " + message, title);
    },

    clearAlerts: function () {
        this.refs.container.clear();
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        AppStore.addAlertListener(this._onAlert);
    },

    componentWillUnmount: function () {
        AppStore.removeAlertListener(this._onAlert);
    },

    /**
     * @return {object}
     */
    render: function () {
        return (
            <div>
                <RouteHandler data={this.props.data}/>
            </div>
        );
    },

    /**
     * Event handler for 'change' events coming from the UserStore
     */
    _onAlert: function () {
        _.forEach(AppStore.getPendingAlerts(), function (alertPayload) {
            this.addAlert(alertPayload.type, alertPayload.message, alertPayload.title);
        }, this);
    }
});

module.exports = App;
