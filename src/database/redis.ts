import Redis = require('redis');
import Config from '../config';

function redisConnectionTest() {
  console.log("Redis 連線中... ");
  // @ts-ignore
  const client = Redis.createClient(Config.REDIS_PORT, Config.REDIS_HOST); // this creates a new client

  client.on('connect', () => {
    console.log('Redis 連線成功 ! ');
  });

  client.on("error", (error) => {
    console.log("redis 連線錯誤 ： ", error)

  })
}

export default { redisConnectionTest };
