import Dotenv from 'dotenv';
import Path from 'path';

import { ConfigDeclare } from './config';

let file = '.env';
if (process.env.NODE_ENV === 'test') {
  file = '.env.test';
} else if (process.env.NODE_ENV === 'production') {
  file = '.env.production';
}

Dotenv.config({ path: Path.join(file) });

export const {
  HOST,
  USERNAME,
  PASSWORD,
  DATABASE,
  DATABASE_TYPE,
  SEQUELIZE_LOGGING,
  MONGO_DB_URI,
  MONGO_DB_DATABASE,
  MONGO_DB_PARAMETER,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_DB,
  SESSION_SECRET,
  SESSION_MAX_AGE,
  SESSION_RESAVE,
  SESSION_SAVE_UNINITIALIZED,
  SESSION_DOMAIN,
  SESSION_SECURE,
  BCRYPT_SALT_ROUNDS,
  NODE_ENV,
  IP_CONNECT_TOTAL_IN_TIME,
  IP_CONNECT_EXPIRE,
} = <ConfigDeclare.StringEnv>process.env;
