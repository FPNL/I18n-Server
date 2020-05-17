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
exports.UserModel = exports.countUsers = exports.createUser = exports.findUser = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize_2 = require("../../../database/sequelize");
class UserModel extends sequelize_1.default.Model {
    validPassword(password) {
        return this.password === password;
    }
}
exports.UserModel = UserModel;
UserModel.init({
    account: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    nickname: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    character: {
        type: sequelize_1.default.ENUM('admin', 'manager', 'adviser'),
        defaultValue: 'adviser',
        allowNull: true,
    },
    timeCreate: {
        type: sequelize_1.default.DATE,
        allowNull: true
    },
    timeUpdate: {
        type: sequelize_1.default.DATE,
        allowNull: true
    },
}, {
    tableName: 'users',
    sequelize: sequelize_2.s_connect()
});
function countUsers(data) {
    return UserModel.count({ where: { account: data.account } });
}
exports.countUsers = countUsers;
function findUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return UserModel.findOne({ where: { account: data.account } });
    });
}
exports.findUser = findUser;
function createUser(data) {
    return UserModel.create(data);
}
exports.createUser = createUser;
