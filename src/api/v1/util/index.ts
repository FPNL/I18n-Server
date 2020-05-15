// Package
import * as Validator from 'express-validator';
import Express from 'express';
// Module
import { HttpStatus, HttpStatusMessage } from '../../../package/httpStatus';
// Typing
import { ControllerDeclare } from '../controller/controller';

function routerResponseFormatter(res: Express.Response, responseData: ControllerDeclare.typicalResponse): void {
    const message = HttpStatusMessage.get(responseData.status);

    if (responseData.status > 600) {
        responseData.status = 400;
    }

    res
        .status(responseData.status)
        .json({ result: responseData.result, message });

}


async function getDataFromModel(modelFn: Function, data: any): Promise<{ result: Promise<Function>; }> {
    try {
        const result = await modelFn(data);
        return { result };
    } catch (e) {
        console.error(" ＝＝＝ getDataFromModel 錯誤 ＝＝＝");
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

async function validationErrorHandler(req: Express.Request): Promise<[boolean, string]> {
    const errors = await Validator.validationResult(req);
    let result = '';
    const isError = !errors.isEmpty();
    if (isError) {
        console.log("資料驗證錯誤", errors);
        result = Object.keys(errors.mapped())[0];
    }
    return [isError, result];
}

export { routerResponseFormatter, getDataFromModel, validationErrorHandler };
