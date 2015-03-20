var React = require('react');
var Router = require('react-router');

var assign = require('object-assign'),
    http = require('superagent');

var AppActions = require('../../actions/AppActions');

var UserStore = require('../../stores/UserStore');

/**
 * Retrieve the current data from the EmailStore and NameStore
 */
function getCurrentState() {
    return AppActions.loadUser(123);
}

var _data = {
    id: 1,
    name: "Tom Hanks"
};

var User = React.createClass({
    mixins: [ Router.State ],

    statics: {
        /**
         * Fetch data for this component for server-side rendering.
         *
         * @param params
         * @returns {*}
         */
        fetchData: function (params, callback) {
            http
                .get('http://localhost:3000/test')
                .end(function (error, result) {
                    console.log("RESULT :: %s", JSON.stringify(result.body));
                    _data = assign(_data, params, result.body);

                    console.log("DATA IS NOW %s", JSON.stringify(_data));

                    callback(null, _data);
                });
        }
    },

    getInitialState: function () {
        console.log("DATA AT INITIAL STAGE IS NOW %s", JSON.stringify(_data));

        return _data;
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
