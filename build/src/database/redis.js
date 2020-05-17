"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.r_connectionTest = exports.r_connect = void 0;
const Redis = __importStar(require("redis"));
const config = __importStar(require("../config"));
const util_1 = require("util");
function r_connect() {
    const redis = Redis.createClient(Number(config.REDIS_PORT), config.REDIS_HOST, {
        db: Number(config.REDIS_DB)
    });
    return redis;
}
exports.r_connect = r_connect;
function r_connectionTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Redis 測試中...");
        const redis = r_connect();
        redis.on('connect', () => {
            console.log('Redis 連線成功 ! ');
        });
        redis.on("error", (error) => {
            console.log("redis 連線錯誤 ： ", error);
        });
        const redisQuit = util_1.promisify(redis.quit).bind(redis);
        const ok = yield redisQuit();
        if (ok) {
            console.log("Redis 測試連線完畢");
            return true;
        }
        else {
            console.error("Redis 關閉連線錯誤");
            return false;
        }
    });
}
exports.r_connectionTest = r_connectionTest;
