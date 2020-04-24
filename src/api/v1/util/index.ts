import Validator = require('express-validator');
import Express = require('express');

import ErrorPackage from '../../../package/e';
import { Controller } from '../controller/controller';

function routerResponseFormatter(res: Express.Response, responseData: Controller.typicalResponse): void {
    const message = ErrorPackage.HttpStatusMessage.get(responseData.status);

    if(responseData.status > 600) {
        responseData.status = 400;
    }

    res
        .status(responseData.status)
        .json({ result: responseData.result, message });

}


async function getDataFromModel(modelFn: Function, data: any): Promise<{ result: Promise<Function> }> {
    try {
        return { result: await modelFn(data) };
    } catch (e) {
        console.error(" ＝＝＝ getDataFromModel 錯誤 ＝＝＝")
        let status = ErrorPackage.HttpStatus.INTERNAL_SERVER_ERROR;

        if (e.name === 'SequelizeValidationError') {
            // TODO 低 紀錄錯誤
        } else if (e.name === 'SequelizeUniqueConstraintError') {
            // TODO 低 紀錄錯誤
        }
        // TODO 低 紀錄錯誤

        throw status;
    }
}

async function validationErrorHandler(req: Express.Request): Promise<[boolean, string]> {
    const errors = await Validator.validationResult(req);
    let result = '';
    const isError = !errors.isEmpty()
    if ( isError ) {
        console.log("資料驗證錯誤", errors);
        result = Object.keys(errors.mapped())[0];
    }
    return [isError, result]
}

export default { routerResponseFormatter, getDataFromModel, validationErrorHandler};
