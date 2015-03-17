var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var NameStore = require('../../stores/NameStore');

/**
 * Retrieve the current data from the EmailStore and NameStore
 */
function getCurrentState() {
    return {
        name: NameStore.getName()
    };
}

var App = React.createClass({

    getInitialState: function () {
        return getCurrentState();
    },

    componentDidMount: function () {
        NameStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        NameStore.removeChangeListener(this._onChange);
    },

    /**
     * @return {object}
     */
    render: function () {
        return (
            <div>
                <h1>Welcome!</h1>
                <Link to="hello-world">Go to "Hello World"</Link>
                <RouteHandler/>
            </div>
        );
    },

    /**
     * Event handler for 'change' events coming from the TodoStore
     */
    _onChange: function () {
        this.setState(getCurrentState());
    }

});

module.exports = App;
