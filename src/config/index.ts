import Dotenv = require('dotenv');
import Path = require('path');

import { Config } from './config';

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
} as Config.StringEnv);
