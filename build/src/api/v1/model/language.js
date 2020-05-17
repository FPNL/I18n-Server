"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.r_getNativeLang = exports.r_setNativeLang = exports.r_getKeyExist = exports.r_removeLangSet = exports.r_getLangSet = exports.r_setLangSet = exports.updateNativeLang = exports.readNativeLang = exports.deleteLang = exports.deleteWords = exports.updateWords = exports.insertWords = exports.readWordsNotInName = exports.readWordsInName = exports.updateLanguageByPushing = exports.readWordsData = exports.readLanguageList = exports.initLanguageModel = void 0;
const util_1 = require("util");
const mongoose_1 = require("../../../database/mongoose");
const redis_1 = require("../../../database/redis");
const redis = redis_1.r_connect();
const mongoose = mongoose_1.m_connect();
const Schema = mongoose.Schema;
const tableNameConfig = 'config';
const tableNameMain = 'languages';
const LangConfigModel = initLangConfigModel(tableNameConfig);
const LangModel = initLanguageModel(tableNameMain);
function initLangConfigModel(tableName_config) {
    const schema = { langs: Array, nativeLang: String };
    const options = {
        timestamps: {
            createdAt: 'time_create',
            updatedAt: 'time_update'
        },
        autoCreate: true,
    };
    const LangConfigModel = mongoose.model(tableName_config, new Schema(schema, options));
    return LangConfigModel;
}
function initLanguageModel(tableName_main) {
    const schema = {
        name: { type: String, unique: true },
        content: { type: Schema.Types.Mixed },
    };
    const options = {
        timestamps: {
            createdAt: 'time_create',
            updatedAt: 'time_update'
        },
        autoCreate: true,
    };
    const LangModel = mongoose.model(tableName_main, new Schema(schema, options));
    return LangModel;
}
exports.initLanguageModel = initLanguageModel;
function readLanguageList() {
    return LangConfigModel.findOne({}, '-_id langs');
}
exports.readLanguageList = readLanguageList;
function readWordsData(data, params) {
    let { limit, skip } = params;
    if (limit > 50) {
        limit = 50;
    }
    return LangModel.find({}, '-_id name content', { skip, limit });
}
exports.readWordsData = readWordsData;
function updateLanguageByPushing(data) {
    return LangConfigModel.findOneAndUpdate({}, { $addToSet: { langs: data.lang } }, {
        upsert: true,
        new: true
    });
}
exports.updateLanguageByPushing = updateLanguageByPushing;
function readWordsInName(data) {
    return LangModel.find({ name: { $in: data } }, '-_id name');
}
exports.readWordsInName = readWordsInName;
function readWordsNotInName(data) {
    return LangModel.find({ name: { $nin: data } }, '-_id name');
}
exports.readWordsNotInName = readWordsNotInName;
function insertWords(data) {
    return LangModel.insertMany(data);
}
exports.insertWords = insertWords;
function updateWords(data) {
    const bulkOps = data.map(value => ({
        updateOne: {
            filter: { name: value.name },
            update: { content: value.content }
        }
    }));
    return LangModel.bulkWrite(bulkOps);
}
exports.updateWords = updateWords;
function deleteWords(data) {
    return LangModel.deleteMany({ name: { $in: data } });
}
exports.deleteWords = deleteWords;
function deleteLang(data) {
    return LangConfigModel.findOneAndUpdate({}, { $pull: { langs: data } });
}
exports.deleteLang = deleteLang;
function readNativeLang() {
    return LangConfigModel.findOne({}, '-_id nativeLang');
}
exports.readNativeLang = readNativeLang;
function updateNativeLang(data) {
    return LangConfigModel.updateOne({}, { nativeLang: data });
}
exports.updateNativeLang = updateNativeLang;
function r_setLangSet(data) {
    const keyName = 'langs';
    return redis.sadd(keyName, data);
}
exports.r_setLangSet = r_setLangSet;
function r_getLangSet() {
    const keyName = 'langs';
    const smembersAsync = util_1.promisify(redis.smembers).bind(redis);
    return smembersAsync(keyName);
}
exports.r_getLangSet = r_getLangSet;
function r_removeLangSet(data) {
    const keyName = 'langs';
    const sremAsync = util_1.promisify(redis.srem).bind(redis);
    return sremAsync(keyName, data);
}
exports.r_removeLangSet = r_removeLangSet;
function r_getKeyExist(data) {
    const keyExistAsync = util_1.promisify(redis.exists).bind(redis);
    return keyExistAsync(data);
}
exports.r_getKeyExist = r_getKeyExist;
function r_setNativeLang(lang) {
    const keyName = "nativeLang";
    const setAsync = util_1.promisify(redis.set).bind(redis);
    return setAsync(keyName, lang);
}
exports.r_setNativeLang = r_setNativeLang;
function r_getNativeLang() {
    const keyName = "nativeLang";
    const getAsync = util_1.promisify(redis.get).bind(redis);
    return getAsync(keyName);
}
exports.r_getNativeLang = r_getNativeLang;
function r_setWordHash(data) {
}
