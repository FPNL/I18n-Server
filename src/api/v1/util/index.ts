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

export { routerResponseFormatter, validationErrorHandler };
