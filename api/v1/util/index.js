const { HttpStatus, HttpStatusMessage } = require('../../../package/e');
const Validator = require('express-validator');

function routerResponseFormatter(res, responseData) {
    const message = HttpStatusMessage.get(responseData.status);

    if(responseData.status > 600) {
        responseData.status = 400;
    }

    res
        .status(responseData.status)
        .json({ result: responseData.result, message });

}


async function getDataFromModel(modelFn, data) {
    try {
        return { result: await modelFn(data) };
    } catch (e) {
        console.error(" ＝＝＝ getDataFromModel 錯誤 ＝＝＝")
        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (e.name === 'SequelizeValidationError') {
            // TODO 低 紀錄錯誤
        } else if (e.name === 'SequelizeUniqueConstraintError') {
            // TODO 低 紀錄錯誤
        }
        // TODO 低 紀錄錯誤

        throw status;
    }
}

async function validationErrorHandler(req) {
    const errors = await Validator.validationResult(req);
    !errors.isEmpty() && console.log("資料驗證錯誤", errors);
    return errors.isEmpty();
}

module.exports = { routerResponseFormatter, getDataFromModel, validationErrorHandler};