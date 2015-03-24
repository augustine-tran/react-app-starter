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
            // We create an initial state first.
            return {
                isLoading: true,
                name: '...'
            };
        }
    },

    componentDidMount: function () {
        UserStore.addChangeListener(this._onChange);

        // TODO: Disable this action if data has already been loaded via getInitialState()
        if (this.state.isLoading) {
            UserActions.readUser(this.props.id);
        }
    },

    componentWillUnmount: function () {
        UserStore.removeChangeListener(this._onChange);
    },

    /**
     * @return {object}
     */
    render: function () {
        if (this.state.isLoading) {
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
     * Event handler for 'change' events coming from the UserStore
     */
    _onChange: function () {
        /**
         * TODO You should either setState() or replaceState(), but make sure you disable the isLoading flag.
         */
        this.replaceState(getCurrentState());
    }

});

module.exports = User;
