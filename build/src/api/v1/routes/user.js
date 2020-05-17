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
exports.userPath = void 0;
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("../controller/user"));
const util_1 = require("../util");
const router = express_1.default.Router();
exports.userPath = {
    Login: '/login',
    Register: '/register'
};
router.post(exports.userPath.Login, userController.customPassportAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { responseData } = req;
    if (!responseData) {
        next(new Error('內部嚴重錯誤'));
    }
    util_1.routerResponseFormatter(res, responseData);
}));
router.post(exports.userPath.Register, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = yield userController.registerHandler(req);
    util_1.routerResponseFormatter(res, responseData);
}));
exports.default = router;
