'use strict';

/*=================================
 Libraries
 =================================*/
import _ from 'lodash';
import alt from '../alt';
import async from 'async';
import Iso from 'iso';

/*=================================
 React & Router
 =================================*/
import React from 'react';
import Router from 'react-router';

/*=================================
 Google Analytics
 =================================*/
import GoogleAnalytics from 'react-ga';

/*=================================
 Routes
 =================================*/
import routes from './routes.jsx';

/*=================================
 Router
 =================================*/

export default class AppRouter {
    /**
     * Client side router initialization.
     * @param data
     */
    static init() {
        Router.run(routes, Router.HistoryLocation, function (Handler, state) {
            GoogleAnalytics.pageview(state.pathname);

            // Loop through the matching routes
            let routesWithData = state.routes.filter((route) => { return route.handler.fetchData; });

            async.map(routesWithData, (route, callback) => {
                // Fetch data for each route
                route.handler.fetchData(state, callback);
            }, () => {
                React.render(<Handler/>, document.body);
            });

        });
    }

    /**
     * Server side rendering - Data retrieval
     */
    static getData(req, res, next) {
        Router.run(routes, req.url, (Handler, state) => {
            res.local = {
                Handler,
                state
            };

            // Loop through the matching routes
            let routesWithData = state.routes.filter((route) => { return route.handler.fetchData; });

            async.map(routesWithData, (route, callback) => {
                // Fetch data for each route
                route.handler.fetchData(state, callback);
            }, error => {
                next(error);
            });
        });
    }

    /**
     * Server side rendering - Website serving
     */
    static serve(req, res, next) {
        let iso = new Iso();
        let Handler = res.local.Handler;

        let htmlBody = React.renderToString(<Handler/>);

        let data = alt.flush(); // Take a snapshot of the datastores and flush it

        iso.add(htmlBody, data); // Add the data snapshot to the response

        res.render('index', {
            body: iso.render(),
            // TODO: Need to think of a way to build the metadata.
            metadata: _.merge({
                title: 'React App Starter',
                description: 'This is a fully isomorphic React / Flux App starter.'
            })
        });
    }
}
