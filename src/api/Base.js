'use strict';

// Libraries
import _ from 'lodash';
import async from 'async';
import http from 'superagent';
import prefix from 'superagent-prefix'

class API {
    constructor () {

    }
}

API.constants = {
    BASE_URL: prefix('http://localhost:8080/api'),
    TIMEOUT_MS: 500
};

export default API;

