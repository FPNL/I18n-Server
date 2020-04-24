import Mongoose = require('mongoose');

import Database from '../../../repository';
import { LangModelType } from './model';
import { Service } from '../service/service';

const mongoose = Database.mongoose.Mongoose;
const Schema = mongoose.Schema;

const tableNameConfig = 'config';
const tableNameMain = 'languages';

const LangConfigModel = initLangConfigModel(tableNameConfig);
const LangModel = initLanguageModel(tableNameMain);

function initLangConfigModel(tableName_config: string) {
    const schema = { langs: Array };
    const LangConfigModel = mongoose.model<LangModelType.LangConfigModel>(tableName_config, new Schema(schema));
    return LangConfigModel;
}

function initLanguageModel(tableName_main: string) {
    const schema = {
        name: { type: String, unique: true },
        content: { type: Schema.Types.Mixed }
    };

    // const result = await LangConfigModel.findOne({}, '-_id langs');
    // if (result) {
    //     // @ts-ignore
    //     const langs: Array<any> = Array.from(new Set(result.langs));
    //     for (let index = 0; index < langs.length; index++) {
    //         const element = langs[index];
    //         schema[element] = String;
    //     }
    // }

    const LangModel = mongoose.model<LangModelType.LangModel>(tableName_main, new Schema(schema));
    return LangModel;
}


function TEST(data: any) {
    console.log(23);

    const bulkOps = [
        { name: 'test1', content: { ch: "hi" } },
        { name: 'test2', content: { ch: "hi" } },
        { name: 'test2', content: { jp: "你" } },
        { name: 'test3', content: { ch: "你" } },
    ].map(value => ({
        updateOne: {
            filter: { name: value.name },
            update: { content: value.content }
        }
    }));
    console.log(bulkOps);

    return LangModel.bulkWrite(bulkOps);
}

// FIXME 以下
/*  這裡全用 raw query */

// function createNewLanguage() {
//     在 languages 新增欄位
// }
//

function readLanguageList() {
    const result = LangConfigModel.findOne({}, '-_id langs')
    return result;
}


function readWordsData(data, params: { limit: number, skip: number }) {
    let { limit, skip } = params;
    if (limit > 50) {
        limit = 50;
    }
    return LangModel.find({}, '-_id', { skip, limit });
}

function updateLanguageByPushing(data: { lang: string; }) {
    return LangConfigModel.findOneAndUpdate({}, { $addToSet: { langs: data.lang } });
}


function readWordExist(data) {

}

function readWordsInName(data: Array<string>) {
    return LangModel.find({ name: { $in: data } }, '-_id name');
}

function readWordsNotInName(data: Array<string>) {
    return LangModel.find({ name: { $nin: data } }, '-_id name');
}

function insertWords(data: Array<Service.wordFormat>) {
    return LangModel.insertMany(data);
}

function updateWords(data: Array<Service.wordFormat>) {
    const bulkOps = data.map(value => ({
        updateOne: {
            filter: { name: value.name },
            update: { content: value.content }
        }
    }));
    return LangModel.bulkWrite(bulkOps);
}
// function insertWord(data) {

//     const dataKeys = Object.keys(data).map(key => `\`${key}\``).join();
//     const dataValues = Object.values(data).map(value => `'${value}'`).join();

//     const query = `INSERT INTO \`${tableName}\` (${dataKeys}) VALUES (${dataValues});`
//     return sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
// }
// //
// // function insertLanguages(data) {
// //     const { name, lang1, lang2 } = data[0];
// //     Mysql.insertMany(data);
// // }





// async function updateWords() {
//     // INSERT INTO tableName (columns...)
//     // VALUES
//     // ('value','value',...),
//     // ('value','value',...)
//     // ON DUPLICATE KEY UPDATE
//     // column=VALUES(column), column2=VALUES(column)
// }

export default {
    TEST,
    initLanguageModel,
    readLanguageList,
    readWordsData,
    updateLanguageByPushing,
    readWordsInName,
    readWordsNotInName,
    insertWords,
    updateWords,
    // readWordExist,
    // insertWord,
};
