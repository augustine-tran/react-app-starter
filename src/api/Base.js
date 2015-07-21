'use strict';

// Libraries
import prefix from 'superagent-prefix'

class API {
    constructor () {

    }
}

API.constants = {
    BASE_URL: prefix('http://localhost:3000'),
    TIMEOUT_MS: 3 * 1000
};

export default API;
