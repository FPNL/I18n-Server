/*
棄用 ｓｑｌ , 沒錢租 GCP...cloud sql
// import Sequelize from 'sequelize';

// import { s_connect } from '../../../database/sequelize';
//   FIXME 增加 validation

// CREATE TABLE `users` (
//   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `account` char(100) COLLATE utf8mb4_unicode_ci NOT NULL,
//   `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
//   `nickname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
//   `character` enum('admin','manager','adviser') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'adviser',
//   `owner` enum('yes','no') COLLATE utf8mb4_unicode_ci DEFAULT 'no',
//   `timeCreate` datetime DEFAULT CURRENT_TIMESTAMP,
//   `timeUpdate` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`),
//   UNIQUE KEY `account` (`account`)
// ) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci

// class UserModel extends Sequelize.Model {
//     public readonly id!: string;
//     public readonly account!: string;
//     public password!: string;
//     public nickname!: string;
//     public character!: string;
//     public readonly timeCreate!: Date;
//     public readonly timeUpdate!: Date;
//     // public customMethod() {
//     //     return this.password;
//     // };
//     validPassword(password: string): boolean {
//         return this.password === password;
//     }
// }

// UserModel.init({
//     account: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     nickname: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     character: {
//         type: Sequelize.ENUM('admin', 'manager', 'adviser'),
//         defaultValue: 'adviser',
//         allowNull: true,
//     },
//     timeCreate: {
//         type: Sequelize.DATE,
//         allowNull: true
//     },
//     timeUpdate: {
//         type: Sequelize.DATE,
//         allowNull: true
//     },
// },
//     {
//         tableName: 'users',
//         sequelize: s_connect()
//     });
*/
import { m_connect } from '../../../database/mongoose';
import { ModelDeclare } from './model';

const mongoose = m_connect();
const Schema = mongoose.Schema;

const tableNameMain = 'users';

const UserModel = initUserModel(tableNameMain);

function initUserModel(tableName_config: string) {
    const schema = {
        account: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true
        },
        character: {
            type: String,
            default: "adviser",
            enum: ["adviser", "admin", "manger"]
        },
        owner: {
            type: Boolean,
            default: false
        },
    };
    const options = {
        timestamps: {
            createdAt: 'time_create',
            updatedAt: 'time_update'
        },
        autoCreate: true, // 若沒有 collection
    };
    return mongoose.model<ModelDeclare.UserModel>(tableName_config, new Schema(schema, options));
}


function countUsers(data: { account: string; }) {
    // return UserModel.count({ where: { account: data.account } });
    return UserModel.countDocuments({ account: data.account });
}

async function findUser(data: { account: string; }) {
    // return UserModel.findOne({ where: { account: data.account } });
    return UserModel.findOne({ account: data.account });
}

function createUser(data: { account: string; password: string; nickname: string; }) {
    // return UserModel.create(data);
    return UserModel.insertMany(data);
}

export { findUser, createUser, countUsers, UserModel };
