'use strict';

/*=================================
 React & Router
 =================================*/
import React from 'react';
import {Route, DefaultRoute} from 'react-router';

/*=================================
 Components
 =================================*/
import App from '../components/App';
import Home from '../components/Home';
import UserDetails from '../components/User/Details';

/*=================================
 ROUTES
 =================================*/
let routes = (
    <Route name="app" path="/" handler={App} >
        <Route name="user-details" path="/user/:id/?" handler={UserDetails} />
        <Route name="user-list" path="/:page/?" handler={Home} />
        <DefaultRoute handler={Home} />
    </Route>
);

export default routes;
