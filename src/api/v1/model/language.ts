import Database from '../../../repository';
const mongoose = Database.mongoose.Mongoose;
const Schema = mongoose.Schema;

const tableNameConfig = 'config';
const tableNameMain = 'languages';

const LangConfigModel = initLangConfigModel(tableNameConfig);
const LangModel = initLanguageModel(tableNameMain);

function initLangConfigModel(tableName_config: string) {
    const LangConfigModel = mongoose.model(tableName_config, new Schema({ langs: Array }));
    return LangConfigModel;
}

async function initLanguageModel(tableName_main: string) {
    const schema = {
        name: { type: String, unique: true }
    };
    const result = await LangConfigModel.findOne({}, 'langs', (err, options) => {});

    if (result) {
        // @ts-ignore
        const langs: Array<any> = Array.from(new Set(result.langs));
        for (let index = 0; index < langs.length; index++) {
            const element = langs[index];
            schema[element] = String;
        }
    }
    return mongoose.model(tableName_main, new Schema(schema));
}

// FIXME 以下
/*  這裡全用 raw query */

// function createNewLanguage() {
//     在 languages 新增欄位
// }
//

function readLanguageList() {
    return LangConfigModel.findOne({}, '-_id langs');
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


// function readWordExist(data) {
//     const sequelize = database.sequelize.sequelize;
//     const columnName = 'name';

//     const query = `SELECT EXISTS(SELECT * FROM ${tableName} WHERE ${columnName}="${data.name}");`;

//     return sequelize.query(query, { type: sequelize.QueryTypes.SELECT});
// }

// function readWordData(data = {}) {
//     const limit = data.limit || 50;

//     const query = `SELECT * FROM ${tableName} LIMIT ${limit};`;

//     return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
// }

// function createLanguageColumn(data = {}) {
//     const columnName = data.lang || 'test';

//     const query = `ALTER TABLE ${tableName} ADD \`${columnName}\` tinytext COLLATE 'utf8mb4_unicode_ci' NOT NULL;`

//     return sequelize.query(query, { type: sequelize.QueryTypes.RAW})

// }

// async function updateWords() {
//     // INSERT INTO tableName (columns...)
//     // VALUES
//     // ('value','value',...),
//     // ('value','value',...)
//     // ON DUPLICATE KEY UPDATE
//     // column=VALUES(column), column2=VALUES(column)
// }

export default {
    // readWordExist,
    // insertWord,
    // readWordData,
    // createLanguageColumn,
    readLanguageList,
    initLanguageModel
};
