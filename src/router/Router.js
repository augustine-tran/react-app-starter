'use strict';

/*=================================
 Libraries
 =================================*/
import _ from 'lodash';
import async from 'async';

/*=================================
 React & Router
 =================================*/
import React from 'react';
import Router from 'react-router';

/*=================================
 Routes
 =================================*/
import Routes from './Routes';

/*=================================
 Router
 =================================*/

/**
 * Client side router initialization.
 * @param data
 */
export function init (data) {
    Router.run(Routes, Router.HistoryLocation, function (Handler) {
        React.render(<Handler data={data}/>, document.body);
    });
}

/**
 * Express style router middleware.
 * @param req
 * @param res
 * @param next
 */
export function server (req, res, next) {
    Router.run(Routes, req.url, (Handler, state) => {

        // Loop through the matching routes
        let routesWithData = state.routes.filter((route) => { return route.handler.fetchData; });

        async.map(routesWithData, (route, callback) => {
            // Fetch data for each route and then merge it back into the data source.
            route.handler.fetchData(state, (error, data) => {
                callback(error, data);
            });
        }, (error, dataArray) => {
            if (!error) {
                let data = {};

                _.each(dataArray, function (dataSet) {
                    _.merge(data, dataSet);
                });

                // TODO: At least one component should set the data.metadata properties, so we can generate the SEO meta-tags.
                // TODO: Make sure all metadata properties are set, and fill missing properties with default values.
                let htmlBody = React.renderToString(<Handler data={data}/>);


                res.render('index', {
                    body: htmlBody,
                    // TODO: The last component to populate the metadata field will dictate the metadata properties.
                    metadata: _.merge({
                        title: 'React App Starter',
                        description: 'This is a fully isomorphic React / Flux App starter.'
                    }, data.metadata),
                    data: safeStringify(data)
                });
            } else {
                // TODO: Render an error page
                res.render('index');
            }
        });
    });
}

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
}
