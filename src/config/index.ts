import Dotenv from 'dotenv';
import Path from 'path';

import { ConfigDeclare } from './config';

let file = '.env';
if (process.env.NODE_ENV === 'test') {
  file = '.env.test';
}

Dotenv.config({ path: Path.join(file) });

export const {
  HOST,
  USERNAME,
  PASSWORD,
  DATABASE,
  DATABASE_TYPE,
  MONGO_DB_URI,
  MONGO_DB_DATABASE,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_DB,
  SESSION_SECRET,
  SESSION_MAX_AGE,
  SESSION_RESAVE,
  SESSION_SAVE_UNINITIALIZED,
  BCRYPT_SALT_ROUNDS,
  ENVIRONMENT
} = <ConfigDeclare.StringEnv>process.env;
