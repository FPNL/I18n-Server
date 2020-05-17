"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const v1_1 = __importDefault(require("./api/v1"));
const passport_1 = __importDefault(require("./package/passport"));
const session_1 = require("./package/session");
const ipLimit_1 = require("./package/ipLimit");
const logger_1 = require("./package/logger");
const app = express_1.default();
app.use(ipLimit_1.iPLimit);
app.use(logger_1.logger);
app.use(session_1.mongoSession);
app.use(helmet_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/api/v1', v1_1.default);
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
app.use(function (err, req, res, next) {
    res
        .status(err.status || 500)
        .json({
        message: err.message,
        stack: err.stack
    });
});
exports.default = app;
