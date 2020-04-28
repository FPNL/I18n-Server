// import Mongoose = require('mongoose');
// import Redis =  require('redis');
const { promisify } = require("util");

import Database from '../../../database';
import { ModelDeclare } from './model';
import { ServiceDeclare } from '../service/service';

const redis = Database.redis.redis;
const mongoose = Database.mongoose.Mongoose;
const Schema = mongoose.Schema;

const tableNameConfig = 'config';
const tableNameMain = 'languages';

const LangConfigModel = initLangConfigModel(tableNameConfig);
const LangModel = initLanguageModel(tableNameMain);

function initLangConfigModel(tableName_config: string) {
    const schema = { langs: Array };
    const LangConfigModel = mongoose.model<ModelDeclare.LangConfigModel>(tableName_config, new Schema(schema));
    return LangConfigModel;
}

function initLanguageModel(tableName_main: string) {
    const schema = {
        name: { type: String, unique: true },
        content: { type: Schema.Types.Mixed }
    };
    const LangModel = mongoose.model<ModelDeclare.LangModel>(tableName_main, new Schema(schema));
    return LangModel;
}

function readLanguageList() {
    const result = LangConfigModel.findOne({}, '-_id langs')
    return result;
}


function readWordsData(data, params: { limit: number, skip: number }) {
    let { limit, skip } = params;
    if (limit > 50) {
        limit = 50;
    }
    return LangModel.find({}, '-_id name content', { skip, limit });
}

function updateLanguageByPushing(data: { lang: string; }) {
    return LangConfigModel.findOneAndUpdate({}, { $addToSet: { langs: data.lang } });
}

function readWordsInName(data: Array<string>) {
    return LangModel.find({ name: { $in: data } }, '-_id name');
}

function readWordsNotInName(data: Array<string>) {
    return LangModel.find({ name: { $nin: data } }, '-_id name');
}

function insertWords(data: Array<ServiceDeclare.wordFormat>) {
    return LangModel.insertMany(data);
}

function updateWords(data: Array<ServiceDeclare.wordFormat>) {
    const bulkOps = data.map(value => ({
        updateOne: {
            filter: { name: value.name },
            update: { content: value.content }
        }
    }));
    return LangModel.bulkWrite(bulkOps);
}

function deleteWords(data: string[]) {
    return LangModel.deleteMany({ name: { $in: data } });
}

function deleteLang(data: string) {
    return LangConfigModel.findOneAndUpdate({}, { $pull: { langs: data } });
}

function r_setLangSet(data: string[]|string): boolean {
    const keyName = 'langs';
    return redis.sadd(keyName, data);

}

function r_getLangSet(): string[] {
    const keyName = 'langs';
    const smembersAsync = promisify(redis.smembers).bind(redis);
    return smembersAsync(keyName);
}

function r_removeLangSet(data: string): string[] {
    const keyName = 'langs';
    const sremAsync = promisify(redis.srem).bind(redis);
    return sremAsync(keyName, data);
}

function r_getKeyExist(data: string): boolean {
    const keyExistAsync = promisify(redis.exists).bind(redis);
    return keyExistAsync(data);
}

function r_setWordHash(data: {name: string,content: {[p: string]: string}}) {
    const name = data.name;
    const hsetAsync = promisify(redis.hset).bind(redis)
    return hsetAsync(name, data.content);
}

export default {
    initLanguageModel,
    readLanguageList,
    readWordsData,
    updateLanguageByPushing,
    readWordsInName,
    readWordsNotInName,
    insertWords,
    updateWords,
    deleteWords,
    deleteLang,
    // readWordExist,
    r_setLangSet,
    r_getLangSet,
    r_removeLangSet,
    r_getKeyExist,
};
