import ExpressLimiter from 'express-limiter';
import { r_connect } from '../../database/redis';
import { IP_CONNECT_EXPIRE, IP_CONNECT_TOTAL_IN_TIME } from '../../config';

// 若是沒有放 app 或是 router，設定參數不行給 path & method
const limiter = ExpressLimiter(null /*app=express()*/, r_connect());
const iPLimit = limiter({
  // path: '*',
  // method: 'all',
  lookup: 'connection.remoteAddress',
  total: Number(IP_CONNECT_TOTAL_IN_TIME),
  expire: Number(IP_CONNECT_EXPIRE),
  onRateLimited: function (req, res, next) {
    console.log("超過使用次數", req.connection.remoteAddress);
    next();
  }
});

// export { iPLimit };
