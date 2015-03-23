var React = require('react');
var Router = require('react-router');

var assign = require('object-assign'),
    async = require('async'),
    http = require('superagent');

var UserActions = require('../../actions/UserActions');

var UserStore = require('../../stores/UserStore');

var User = React.createClass({
    mixins: [ Router.State ],

    /**
     * Static methods. Should not update component states.
     */
    statics: {
        /**
         * Fetch data for this component for server-side rendering.
         *
         * @param params
         * @returns {*}
         */
        fetchData: function (params, callback) {
            UserActions.readUser(params.id, callback);
        }
    },

    getInitialState: function () {
        var state;

        if (this.props.data != null) {
            // Server side rendering. Let's use the provided data first.
            state = this.props.data;
        } else {
            // Client side rendering.
            // TODO: Get default state from UserStore AND fire off an API call to get a specific user.
            UserActions.readUser(params.id);
        }

        return state;
    },

    componentDidMount: function () {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        UserStore.removeChangeListener(this._onChange);
    },

    /**
     * @return {object}
     */
    render: function () {
        return (
            <span>Request for user "{this.state.name}"!</span>
        );
    },

    /**
     * Event handler for 'change' events coming from the TodoStore
     */
    _onChange: function () {
        this.setState(getCurrentState());
    }

});

module.exports = User;
