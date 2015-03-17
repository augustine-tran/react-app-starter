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
    HelloWorld = require('../components/HelloWorld');
;

/*=================================
 ROUTES
 =================================*/

var routes = (
    <Route name="app" path="/" handler={App} >
        <Route name="hello-world" handler={HelloWorld} />
    </Route>
);

module.exports.init = function () {
    Router.run(routes, Router.HistoryLocation, function (Handler, state) {

        // Loop through the matching routes
        var routesWithData = state.routes.filter(function (route) { return route.handler.fetchData; });

        routesWithData.forEach(function (route) {
            // Fetch data for each route
            route.handler.fetchData();

            // We can even get the meta data for each route and compile it for SEO injection
            console.log("TITLE %s", route.handler.getMetaData().title);
        });

        React.render(
            <Handler/>,
            document.body);
    });
};

