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
    Test = require('../components/Test');

/*=================================
 ROUTES
 =================================*/

var routes = (
  <Route name="app" path="/" handler={App} >
    <Route name="test" handler={Test} />
  </Route>
);

module.exports.init = function () {
  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(
      <Handler/>,
      document.body);
  });
};

