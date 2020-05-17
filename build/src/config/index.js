"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IP_CONNECT_EXPIRE = exports.IP_CONNECT_TOTAL_IN_TIME = exports.NODE_ENV = exports.BCRYPT_SALT_ROUNDS = exports.SESSION_SECURE = exports.SESSION_DOMAIN = exports.SESSION_SAVE_UNINITIALIZED = exports.SESSION_RESAVE = exports.SESSION_MAX_AGE = exports.SESSION_SECRET = exports.REDIS_DB = exports.REDIS_HOST = exports.REDIS_PORT = exports.MONGO_DB_DATABASE = exports.MONGO_DB_URI = exports.SEQUELIZE_LOGGING = exports.DATABASE_TYPE = exports.DATABASE = exports.PASSWORD = exports.USERNAME = exports.HOST = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
let file = '.env';
if (process.env.NODE_ENV === 'test') {
    file = '.env.test';
}
dotenv_1.default.config({ path: path_1.default.join(file) });
_a = process.env, exports.HOST = _a.HOST, exports.USERNAME = _a.USERNAME, exports.PASSWORD = _a.PASSWORD, exports.DATABASE = _a.DATABASE, exports.DATABASE_TYPE = _a.DATABASE_TYPE, exports.SEQUELIZE_LOGGING = _a.SEQUELIZE_LOGGING, exports.MONGO_DB_URI = _a.MONGO_DB_URI, exports.MONGO_DB_DATABASE = _a.MONGO_DB_DATABASE, exports.REDIS_PORT = _a.REDIS_PORT, exports.REDIS_HOST = _a.REDIS_HOST, exports.REDIS_DB = _a.REDIS_DB, exports.SESSION_SECRET = _a.SESSION_SECRET, exports.SESSION_MAX_AGE = _a.SESSION_MAX_AGE, exports.SESSION_RESAVE = _a.SESSION_RESAVE, exports.SESSION_SAVE_UNINITIALIZED = _a.SESSION_SAVE_UNINITIALIZED, exports.SESSION_DOMAIN = _a.SESSION_DOMAIN, exports.SESSION_SECURE = _a.SESSION_SECURE, exports.BCRYPT_SALT_ROUNDS = _a.BCRYPT_SALT_ROUNDS, exports.NODE_ENV = _a.NODE_ENV, exports.IP_CONNECT_TOTAL_IN_TIME = _a.IP_CONNECT_TOTAL_IN_TIME, exports.IP_CONNECT_EXPIRE = _a.IP_CONNECT_EXPIRE;
