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
exports.s_connectionTest = exports.s_connect = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const config = __importStar(require("../config"));
function s_connect() {
    return new sequelize_1.default.Sequelize(config.DATABASE, config.USERNAME, config.PASSWORD, {
        host: config.HOST,
        dialect: config.DATABASE_TYPE,
        define: { timestamps: false },
        logging: config.SEQUELIZE_LOGGING === 'false' ? false : console.log,
    });
}
exports.s_connect = s_connect;
function s_connectionTest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Sequelize 測試連線中...');
            const sequelize = yield s_connect();
            yield sequelize.authenticate();
            yield sequelize.close();
            console.log('Sequelize 測試連線成功 ! ');
            return true;
        }
        catch (error) {
            console.error('Sequelize 測試連接失敗 : ', error);
            return false;
        }
    });
}
exports.s_connectionTest = s_connectionTest;
;
