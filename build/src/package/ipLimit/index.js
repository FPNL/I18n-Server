"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iPLimit = void 0;
const express_limiter_1 = __importDefault(require("express-limiter"));
const redis_1 = require("../../database/redis");
const config_1 = require("../../config");
const limiter = express_limiter_1.default(null, redis_1.r_connect());
const iPLimit = limiter({
    lookup: 'connection.remoteAddress',
    total: Number(config_1.IP_CONNECT_TOTAL_IN_TIME),
    expire: Number(config_1.IP_CONNECT_EXPIRE),
    onRateLimited: function (req, res, next) {
        console.log("超過使用次數", req.connection.remoteAddress);
        next();
    }
});
exports.iPLimit = iPLimit;
