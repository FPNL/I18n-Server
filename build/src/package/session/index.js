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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoSession = void 0;
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_session_1 = __importDefault(require("express-session"));
const config = __importStar(require("../../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const MongoStore = connect_mongo_1.default(express_session_1.default);
const mongoSession = express_session_1.default({
    cookie: {
        secure: config.SESSION_SECURE === 'true',
        domain: config.SESSION_DOMAIN
    },
    secret: config.SESSION_SECRET,
    resave: config.SESSION_RESAVE === 'true',
    saveUninitialized: config.SESSION_SAVE_UNINITIALIZED === 'true',
    store: new MongoStore({
        mongooseConnection: mongoose_1.default.connection
    }),
});
exports.mongoSession = mongoSession;
