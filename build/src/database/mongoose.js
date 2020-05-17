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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.m_connectionTest = exports.m_connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config = __importStar(require("../config"));
function m_connect() {
    mongoose_1.default.connect(config.MONGO_DB_URI + config.MONGO_DB_DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        authSource: 'admin',
        useFindAndModify: false
    });
    return mongoose_1.default;
}
exports.m_connect = m_connect;
function m_connectionTest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('mongoose 測試連線...', config.MONGO_DB_URI + config.MONGO_DB_DATABASE);
            const mongooseClient = yield m_connect();
            const db = mongooseClient.connection;
            db.on('error', console.error.bind(console, 'MongoDB 連線失敗 : '));
            db.once('open', () => console.log('Mongoose 測試連線成功 ! '));
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
exports.m_connectionTest = m_connectionTest;
