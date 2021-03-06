import * as Redis from 'redis';

import * as config from '../config';
import { promisify } from 'util';

function r_connect() {
  // this creates a new client
  const redis = Redis.createClient(
    Number(config.REDIS_PORT),
    config.REDIS_HOST, {
    db: Number(config.REDIS_DB)
  }
  );
  return redis;
}

async function r_connectionTest() {
  console.log("Redis 測試中...");
  const redis = r_connect();

  redis.on('connect', () => {
    console.log('Redis 連線成功 ! ');
  });

  redis.on("error", (error) => {
    console.log("redis 連線錯誤 ： ", error);
  });
  const redisQuit = promisify(redis.quit).bind(redis);
  const ok = await redisQuit();
  if (ok) {
    console.log("Redis 測試連線完畢");
    return true;
  } else {
    console.error("Redis 關閉連線錯誤");
    return false;
  }
}
// 沒錢買 線上 redis 改用 mongo
export { r_connect, r_connectionTest };
