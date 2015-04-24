'use strict';

// Libraries
//import async from 'async';

// Dispatcher and constants
import alt from '../alt';

class AppActions {
    constructor() {
        this.generateActions('showAlert');
    }
}

export default AppActions = alt.createActions(AppActions);
