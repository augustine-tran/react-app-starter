'use strict';

// Libraries
import async from 'async';
import http from 'superagent';
import validator from 'validator';

// Base API class
import Base from './Base';

class User extends Base {
    static login(email, password) {
        return () => {
            let promise = new Promise((resolve, reject) => {
                async.waterfall([
                    function (callback) {
                        http
                            .post('/authentication/connect/local')
                            .use(super.constants.BASE_URL)
                            .type('json')
                            .send({
                                email,
                                password
                            })
                            .timeout(super.constants.TIMEOUT_MS)
                            .end(callback);
                    }, function (result, callback) {
                        callback(null, result.body);
                    }
                ], (error, data) => {
                    if (!error) {
                        resolve(data);
                    } else {
                        reject(error);
                    }
                });
            });

            return promise;
        };
    }
}

export default User;
