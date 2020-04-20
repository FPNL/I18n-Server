const database = require('../../../repository');
const Sequelize = require('sequelize');
const sequelize = database.sequelize.sequelize;
const databaseName = 'i18n_users';
const tableName = "languages";
/*  這裡全用 raw query */

// function createNewLanguage() {
//     在 languages 新增欄位
// }
//

function readLanguageList() {
    // 從 languages 取得 欄位名稱，要去掉 id
    const removeColumn = 'id';

    const query = `SELECT REPLACE(GROUP_CONCAT(COLUMN_NAME),  '${removeColumn},', '') as COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA='${databaseName}'
    AND TABLE_NAME='${tableName}';`

    // const query = `SELECT COLUMN_NAME
    //     FROM INFORMATION_SCHEMA.COLUMNS
    //     WHERE TABLE_SCHEMA='${databaseName}'
    //     AND TABLE_NAME='${tableName}';`;

    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

}

function insertWord(data) {

    const dataKeys = Object.keys(data).map(key => `\`${key}\``).join();
    const dataValues = Object.values(data).map(value => `'${value}'`).join();

    const query = `INSERT INTO \`${tableName}\` (${dataKeys}) VALUES (${dataValues});`
    return sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
}
//
// function insertLanguages(data) {
//     const { name, lang1, lang2 } = data[0];
//     Mysql.insertMany(data);
// }


function readWordExist(data) {
    const sequelize = database.sequelize.sequelize;
    const columnName = 'name';

    const query = `SELECT EXISTS(SELECT * FROM ${tableName} WHERE ${columnName}="${data.name}");`;

    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT});
}

function readWordData(data = {}) {
    const limit = data.limit || 50;

    const query = `SELECT * FROM ${tableName} LIMIT ${limit};`;

    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
}

function createLanguageColumn(data = {}) {
    const columnName = data.lang || 'test';

    const query = `ALTER TABLE ${tableName} ADD \`${columnName}\` tinytext COLLATE 'utf8mb4_unicode_ci' NOT NULL;`

    return sequelize.query(query, { type: sequelize.QueryTypes.RAW})

}

async function updateWords() {
    // INSERT INTO tableName (columns...)
    // VALUES
    // ('value','value',...),
    // ('value','value',...)
    // ON DUPLICATE KEY UPDATE
    // column=VALUES(column), column2=VALUES(column)
}

module.exports = { readWordExist, insertWord, readLanguageList, readWordData, createLanguageColumn, initLanguageModel };
