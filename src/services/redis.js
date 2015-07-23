'use strict';

import redis from 'redis';

import redisConfigs from '../configs/redis';

let redisClient;

export default {
    connect: function() {
        if (redisClient == null) {
            redisClient = redis.createClient(redisConfigs.connection.port, redisConfigs.connection.host);
        }

        return redisClient;
    }
};
