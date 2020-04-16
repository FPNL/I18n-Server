const database = require('../../../repository');
const Sequelize = require('sequelize');

const User = database.sequelize.define('user', {
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

const countUsers = (data) => {
    return User.count({ where: {account: data.account} });
}

const findUser = (data) => {
    return User.findOne({where: { account: data.account }});
}

const createUser = (data) => {
    return User.create(data);
}


module.exports = { findUser, createUser, countUsers };