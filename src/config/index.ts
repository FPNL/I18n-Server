import Dotenv from 'dotenv';
import Path from 'path';

import { ConfigDeclare } from './config';

Dotenv.config({ path: Path.join('.env') });

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
  SESSION_SECRET,
  SESSION_MAX_AGE,
  SESSION_RESAVE,
  SESSION_SAVE_UNINITIALIZED,
  BCRYPT_SALT_ROUNDS,
  ENVIRONMENT
} = <ConfigDeclare.StringEnv>process.env;
