
import Dotenv from 'dotenv';
import Path from 'path';
import { Config } from './config';

Dotenv.config({ path: Path.join('.env') });

const {
  HOST,
  USERNAME,
  PASSWORD,
  DATABASE,
  DATABASE_TYPE,
  MONGO_DB_URI,
  MONGO_DB_DATABASE
} = process.env;

export default ({
  HOST,
  USERNAME,
  PASSWORD,
  DATABASE,
  DATABASE_TYPE,
  MONGO_DB_URI,
  MONGO_DB_DATABASE
} as Config.StringEnv);
