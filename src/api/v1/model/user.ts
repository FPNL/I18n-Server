import database from '../../../repository';
import Sequelize from 'sequelize';

interface UserModel extends Sequelize.Model {
    readonly id: string;
    readonly account: string;
    readonly password: string;
    readonly nickname: string;
    readonly timeCreate: Date;
    readonly timeUpdate: Date;
  }

  // Need to declare the static model so `findOne` etc. use correct types.
  type UserModelStatic = typeof Sequelize.Model & {
    new (values?: object, options?: Sequelize.BuildOptions): UserModel;
  }

const User = <UserModelStatic>database.sequelize.sequelize.define('user', {
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
        allowNull: true},
})

function countUsers(data) {
    return User.count({ where: {account: data.account} });
}

async function findUser(data) {
    return User.findOne({where: { account: data.account }});
}

function createUser(data) {
    return User.create(data);
}

export default { findUser, createUser, countUsers };
