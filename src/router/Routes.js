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
import User from '../components/User';

/*=================================
 ROUTES
 =================================*/
let routes = (
    <Route name="app" path="/" handler={App} >
        <Route name="user" path="/user/:id" handler={User}/>
    </Route>
);

export default routes;
