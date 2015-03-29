'use strict';

// Libraries
import _ from 'lodash';
import async from 'async';
import http from 'superagent';
import prefix from 'superagent-prefix'

export default class API {
    constructor () {

    }
}

API.constants = {
    BASE_URL: prefix('http://localhost:3000'),
    TIMEOUT_MS: 500
};


