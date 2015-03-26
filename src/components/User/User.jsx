// Libraries
var _ = require('lodash');

// React
var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler;

// Actions
var AppActions = require('../../actions/AppActions'),
    UserActions = require('../../actions/UserActions');

// Stores
var UserStore = require('../../stores/UserStore');

function getCurrentState (id) {
    return {
        user: UserStore.get(id)
    };
}

function fireActions (params, callback) {
    UserActions.readUser(params.id, callback);
}

var User = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

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
        fetchData: function (state, callback) {
            fireActions(state.params, callback);
        }
    },

    getInitialState: function () {
        var initialState = {
            user: {
                name: '...'
            }
        };

        if (this.props.data != null) {
            // Server side rendering. Let's use the provided data first.
            _.merge(initialState, this.props.data);
        }

        console.log("INITIAL STATE :: %s", JSON.stringify(initialState));

        return initialState;
    },

    componentDidMount: function () {
        UserStore.addChangeListener(this._onChange);

        console.log("COMPONENT DID MOUNT WITH PARAMS %s", JSON.stringify(this.context.router.getCurrentParams()));

        fireActions(this.context.router.getCurrentParams());
    },

    componentWillUnmount: function () {
        UserStore.removeChangeListener(this._onChange);
    },

    /**
     * @return {object}
     */
    render: function () {
        console.log("USER PROPS :: %s", JSON.stringify(this.props));
        console.log("USER STATE :: %s", JSON.stringify(this.state));

        return (
            <div>
                <p><span>Request for user "{ this.state.user.name }"!</span></p>
                <button className="primary" onClick={function () {AppActions.showAlert('info', 'oh my...', 'hello')}}>Show Alert</button>
                <RouteHandler data={this.props.data}/>
            </div>
        );
    },

    /**
     * Event handler for 'change' events coming from the UserStore
     */
    _onChange: function () {
        this.replaceState(getCurrentState(this.context.router.getCurrentParams().id));
    }

});

module.exports = User;
