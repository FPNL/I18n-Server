"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./middleware/auth");
const user_1 = __importDefault(require("./routes/user"));
const language_1 = __importDefault(require("./routes/language"));
const subApp_v1 = express_1.default();
subApp_v1.use('/user', auth_1.isAuthorization, user_1.default);
subApp_v1.use('/language', auth_1.isAuthorization, auth_1.isAuthByPassport, language_1.default);
exports.default = subApp_v1;
