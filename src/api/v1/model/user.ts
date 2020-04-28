import Sequelize from 'sequelize';

import database from '../../../database';

//   FIXME 增加 validation
class User extends Sequelize.Model {
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

User.init({
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
    sequelize: database.sequelize.sequelize
});

function countUsers(data: { account: string; }) {
    return User.count({ where: {account: data.account} });
}

async function findUser(data: { account: string; }) {
    return User.findOne({ where: { account: data.account } });
}

function createUser(data: { account: string; password: string; nickname: string; }) {
    return User.create(data);
}

export default { findUser, createUser, countUsers, User };
