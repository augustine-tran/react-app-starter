var React = require('react');
var Router = require('react-router');

var UserActions = require('../../actions/UserActions');

var UserStore = require('../../stores/UserStore');

function getCurrentState () {
    return UserStore.get();
}

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
        if (this.props.data != null) {
            // Server side rendering. Let's use the provided data first.
            return this.props.data;
        } else {
            // Client side rendering.
            // TODO: Fire off an API call to get a specific user.
            // TODO: Figure out a way to load data from DOM (right after server side rendering).
            UserActions.readUser(this.props.id);

            return {
                loading: true,
                name: '...'
            };
        }
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
        if (this.state.loading) {
            return (
                <span>Loading...</span>
            );
        } else {
            return (
                <span>Request for user "{this.state.name}"!</span>
            );
        }
    },

    /**
     * Event handler for 'change' events coming from the TodoStore
     */
    _onChange: function () {
        this.setState(getCurrentState());
    }

});

module.exports = User;
