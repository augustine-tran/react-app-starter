var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({

    getInitialState: function () {
        return {};
    },

    /**
     * @return {object}
     */
    render: function () {
        return (
            <div>
                <h1>Welcome!</h1>
                <RouteHandler data={this.props.data}/>
            </div>
        );
    }
});

module.exports = App;
