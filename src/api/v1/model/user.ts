import Sequelize from 'sequelize';

import { s_connect } from '../../../database/sequelize';

//   FIXME 增加 validation

/*
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account` char(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `character` enum('admin','manager','adviser') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'adviser',
  `owner` enum('yes','no') COLLATE utf8mb4_unicode_ci DEFAULT 'no',
  `timeCreate` datetime DEFAULT CURRENT_TIMESTAMP,
  `timeUpdate` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
*/
class UserModel extends Sequelize.Model {
    public readonly id!: string;
    public readonly account!: string;
    public password!: string;
    public nickname!: string;
    public readonly timeCreate!: Date;
    public readonly timeUpdate!: Date;
    // public customMethod() {
    //     return this.password;
    // };
    validPassword(password: string): boolean {
        return this.password === password;
    }
}

UserModel.init({
    account: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    timeCreate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    timeUpdate: {
        type: Sequelize.DATE,
        allowNull: true
    },
},
    {
        tableName: 'users',
        sequelize: s_connect()
    });

function countUsers(data: { account: string; }) {
    return UserModel.count({ where: { account: data.account } });
}

async function findUser(data: { account: string; }) {
    return UserModel.findOne({ where: { account: data.account } });
}

function createUser(data: { account: string; password: string; nickname: string; }) {
    return UserModel.create(data);
}

export { findUser, createUser, countUsers, UserModel };
