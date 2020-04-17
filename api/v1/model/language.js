const database = require('../../../repository');
const Sequelize = require('sequelize');

/*  這裡全用 raw query */

// function createNewLanguage() {
//     在 languages 新增欄位
// }
//
function readLanguageList() {
    // 從 languages 取得 欄位名稱，要去掉 id, name
    const sequelize = database.sequelize.sequelize;

    const databaseName = 'i18n_users';
    const tableName = 'languages';
    const query = `SELECT \`COLUMN_NAME\`
        FROM \`INFORMATION_SCHEMA\`.\`COLUMNS\`
        WHERE \`TABLE_SCHEMA\`='${databaseName}'
        AND \`TABLE_NAME\`='${tableName}';`;

    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

}

function insertWord(data) {
    const sequelize = database.sequelize.sequelize;
    const dataKeys = Object.keys(data).map(key => `\`${key}\``).join();
    const dataValues = Object.values(data).map(value => `'${value}'`).join();
    const tableName = 'languages';

    const query = `INSERT INTO \`${tableName}\` (${dataKeys}) VALUES (${dataValues});`
    return sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
}
//
// function insertLanguages(data) {
//     const { name, lang1, lang2 } = data[0];
//     Mysql.insertMany(data);
// }


async function readWordExist(data) {
    const sequelize = database.sequelize.sequelize;

    const query = `SELECT EXISTS(SELECT * FROM languages WHERE name="${data.name}");`;

    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT});
}

// function getWords() {
//     const limit = 50;
//     Mysql.findAll().limit(limit);
// }

module.exports = { readWordExist, insertWord, readLanguageList };
