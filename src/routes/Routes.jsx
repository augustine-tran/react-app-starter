/*=================================
 Libraries
 =================================*/
var _ = require('lodash'),
    async = require('async');

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

module.exports.init = function (data) {
    Router.run(routes, Router.HistoryLocation, function (Handler, state) {
        React.render(<Handler data={data}/>, document.body);
    });
};

module.exports.router = function (req, res, next) {
    Router.run(routes, req.url, function (Handler, state) {

        // Loop through the matching routes
        var routesWithData = state.routes.filter(function (route) { return route.handler.fetchData; });

        async.map(routesWithData, function (route, callback) {
            // Fetch data for each route and then merge it back into the data source.
            route.handler.fetchData(state.params, function (error, data) {
                callback(null, data);
            });
        }, function (error, dataArray) {
            if (!error) {
                var data = {};

                _.each(dataArray, function (dataSet) {
                    _.merge(data, dataSet);
                });

                // TODO: At least one component should set the data.metadata properties, so we can generate the SEO meta-tags.
                // TODO: Make sure all metadata properties are set, and fill missing properties with default values.
                var htmlBody = React.renderToString(<Handler data={data}/>);

                res.render('index', {
                    body: htmlBody,
                    // TODO: The last component to populate the metadata field will dictate the metadata properties.
                    metadata: data.metadata || {
                        title: "Qanvast Web",
                        description: "This is a test description."
                    },
                    data: safeStringify(data)
                });
            } else {
                // TODO: Render an error page
                res.render('index');
            }
        });
    });
};

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
