import Dotenv = require('dotenv');
import Path = require('path');

import { ConfigDeclare } from './config';

Dotenv.config({ path: Path.join('.env') });

const {
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
} = process.env;

export default ({
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
} as ConfigDeclare.StringEnv);
