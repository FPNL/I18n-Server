import { ControllerDeclare } from './api/v1/controller/controller';

export { };

declare global {
  namespace Express {
    interface Request {
      responseData: ControllerDeclare.typicalResponse;
    }
    interface Response {
      customStatusCode: number;
    }
  }
}
