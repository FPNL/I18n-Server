import Redis = require('redis');

import config from '../config';

const redis = Redis.createClient(Number(config.REDIS_PORT), config.REDIS_HOST); // this creates a new client

function redisConnectionTest() {
  console.log("Redis 連線中... ");

  redis.on('connect', () => {
    console.log('Redis 連線成功 ! ');
  });

  redis.on("error", (error) => {
    console.log("redis 連線錯誤 ： ", error)

  })
}

export default { redisConnectionTest, redis };
