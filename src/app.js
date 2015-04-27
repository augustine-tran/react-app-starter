'use strict';

import Router from './router';

/*=================================
 Bootstrapping Libraries
 =================================*/
import alt from './alt';
import Iso from 'iso';

/*=================================
 Google Analytics
 =================================*/
import GoogleAnalytics from 'react-ga';

if (typeof window !== 'undefined') {
    window.onload = function () {
        GoogleAnalytics.initialize('UA-xxxxxxxx-x');

        Iso.bootstrap(state => {
            alt.bootstrap(state);

            Router.init();
        });
    };
}
