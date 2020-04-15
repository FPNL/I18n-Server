// 不改變 result 但是要確認 http code

const {user: UserModel} = require('../model');
const HttpStatus = require('http-status-codes')

async function getDataFromModel(modelFn, data) {
    let status;

    try {
        status = HttpStatus.OK;

        const result = await modelFn(data);
        return { status, result };
    } catch (e) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (e.name === 'SequelizeValidationError') {
            status = HttpStatus.BAD_REQUEST
        }

        return { status };
    }
}

async function checkUserExist(data) {
    let { status, result } = await getDataFromModel(UserModel.countUsers, data);

    if(result < 1) {
        status = HttpStatus.BAD_REQUEST;
    } else if (result > 1) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return { status, result };
}

function register(data) {
    return getDataFromModel(UserModel.createUser, data);
}

module.exports = { checkUserExist, register }