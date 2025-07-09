import { Response } from 'express';

export abstract class BaseController {
  protected sendResponse(res: Response,statusCode: number, message: string,data?: any,dataName: string = "data") {
    return res.status(statusCode).json({
      message,
      [dataName]: data
    });
  }
}
