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
var RouteHandler = Router.RouteHandler;

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

        // Loop through the matching routes
        if (state.routes != null && state.routes.length >= 1) {
            for (var i = 0; i < state.routes.length; ++i) {
                console.log("MATCH ROUTE[%s] :: %s", i, JSON.stringify(state.routes[i]));
            }
        }

        React.render(
            <Handler data={{user: 1234}}/>,
            document.body);
    });
};

module.exports.router = function (req, res, next) {
    Router.run(routes, req.originalUrl, function (Handler, state) {

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
            // TODO: At least one component should set the data.seo properties, so we can generate the SEO meta-tags.
            // var metaTags = generateMetaTags(data.seo);

            var html = React.renderToString(<Handler/>);

            console.log(html);

            res.send(html);
            // TODO: Inject html and metaTags in index.html template.
        });
    });
};
