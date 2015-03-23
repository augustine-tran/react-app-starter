var React = require('react');
var Router = require('react-router');

var assign = require('object-assign'),
    async = require('async'),
    http = require('superagent');

var AppActions = require('../../actions/AppActions');

var UserStore = require('../../stores/UserStore');

/**
 * Retrieve the current data from the EmailStore and NameStore
 */
function getCurrentState() {
    return AppActions.loadUser(123);
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
            // TODO: Implement API calls here.
            async.waterfall([
                function (callback) {
                    // TODO Refactor this out to a DAO layer.
                    http
                        .get('http://localhost:3000/test')
                        .end(callback);
                },

                function (result, callback) {
                    console.log("RESULT :: %s", JSON.stringify(result.body));

                    callback(null, assign(params, result.body)); // Merge initial params with current response.
                }
            ], callback);
        }
    },

    getInitialState: function () {
        console.log("DATA AT INITIAL STAGE IS NOW %s", JSON.stringify(this.props.data));

        return this.props.data;
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
