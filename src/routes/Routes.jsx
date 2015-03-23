/*=================================
 Libraries
 =================================*/
var async = require('async'),
    assign = require('object-assign');

/*=================================
 React & Router
 =================================*/
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

/*=================================
 Components
 =================================*/
var App = require('../components/App'),
    User = require('../components/User');

/*=================================
 ROUTES
 =================================*/
var routes = (
    <Route name="app" path="/" handler={App} >
        <Route name="user" path="/user/:id" handler={User}>
        </Route>
    </Route>
);

module.exports.init = function () {
    Router.run(routes, Router.HistoryLocation, function (Handler, state) {
        React.render(<Handler/>, document.body);
    });
};

module.exports.router = function (req, res, next) {
    Router.run(routes, req.url, function (Handler, state) {

        // Loop through the matching routes
        var routesWithData = state.routes.filter(function (route) { return route.handler.fetchData; });

        var data = {};

        async.each(routesWithData, function (route, callback) {
            // Fetch data for each route and then merge it back into the data source.
            route.handler.fetchData(state.params, function (error, response) {
                data = assign(data, response);
                callback();
            });
        }, function (error) {
            // TODO: At least one component should set the data.metadata properties, so we can generate the SEO meta-tags.
            // TODO: Make sure all metadata properties are set, and fill missing properties with default values.
            var htmlBody = React.renderToString(<Handler data={data}/>);

            console.log("RENDERED BODY :: %s", htmlBody);

            var testdata = {
                body: htmlBody,
                metadata: data.metadata || {
                    title: "Qanvast Web",
                    description: "This is a test description."
                }
            };

            res.render('index', testdata);
        });
    });
};
