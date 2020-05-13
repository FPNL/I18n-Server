// 套件
// import Mongoose = require('mongoose');
// import Redis =  require('redis');
// import { promisify } from "util";
import { promisify } from "util";

// 模組
import { m_connect } from '../../../database/mongoose';
import { r_connect } from '../../../database/redis';

// 型別
import { ModelDeclare } from './model';
import { ServiceDeclare } from '../service/service';

const redis = r_connect();
const mongoose = m_connect();
const Schema = mongoose.Schema;

const tableNameConfig = 'config';
const tableNameMain = 'languages';

const LangConfigModel = initLangConfigModel(tableNameConfig);
const LangModel = initLanguageModel(tableNameMain);

function initLangConfigModel(tableName_config: string) {
    const schema = { langs: Array, nativeLang: String };
    const options = {
        timestamps: {
            createdAt: 'time_create',
            updatedAt: 'time_update'
        },
        autoCreate: true,
    };
    const LangConfigModel = mongoose.model<ModelDeclare.LangConfigModel>(tableName_config, new Schema(schema, options));
    return LangConfigModel;
}

function initLanguageModel(tableName_main: string) {
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
    const LangModel = mongoose.model<ModelDeclare.LangModel>(tableName_main, new Schema(schema, options));
    return LangModel;
}

function readLanguageList() {
    return LangConfigModel.findOne({}, '-_id langs');
}


function readWordsData(data, params: { limit: number, skip: number; }) {
    let { limit, skip } = params;
    if (limit > 50) {
        limit = 50;
    }
    return LangModel.find({}, '-_id name content', { skip, limit });
}

function updateLanguageByPushing(data: { lang: string; }) {
    return LangConfigModel.findOneAndUpdate({},
        { $addToSet: { langs: data.lang } },
        {
            upsert: true,
            new: true
        },
    );
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

function readNativeLang() {
    return LangConfigModel.findOne({}, '-_id nativeLang');
}

function updateNativeLang(data: string) {
    return LangConfigModel.updateOne({}, { nativeLang: data });
}

function r_setLangSet(data: string[] | string): boolean {
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

function r_setNativeLang(lang: string) {
    const keyName = "nativeLang";
    const setAsync = promisify(redis.set).bind(redis);
    return setAsync(keyName, lang);
}

function r_getNativeLang() {
    const keyName = "nativeLang";
    const getAsync = promisify(redis.get).bind(redis);
    return getAsync(keyName);
}

function r_setWordHash(data: { name: string, content: { [p: string]: string; }; }) {
    // const name = data.name;
    // const hsetAsync = promisify(redis.hset).bind(redis);
    // return hsetAsync(name, data.content);
}

export {
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
    readNativeLang,
    updateNativeLang,
    // readWordExist,
    r_setLangSet,
    r_getLangSet,
    r_removeLangSet,
    r_getKeyExist,
    r_setNativeLang,
    r_getNativeLang,
};
