"use strict";
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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const user_1 = require("../../api/v1/model/user");
const user_2 = require("../../api/v1/controller/user");
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.UserModel.findByPk(id);
            done(null, user);
        }
        catch (error) {
            done(error, false);
        }
    });
});
passport_1.default.use(new passport_local_1.default.Strategy({
    usernameField: 'account',
    passReqToCallback: true,
}, function (req, _account, _password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const [err, user] = yield user_2.loginHandler(req);
        done(err, user);
    });
}));
exports.default = passport_1.default;
