import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export class HttpException extends Error {
  public status: number;
  public message: string;
  public data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data
  }
}

export class UnAuthorizedException extends HttpException {
    constructor(message= "please login to continue"){
        super(message, 401)
    }
}

export class ForbiddenException extends HttpException {
    constructor(message= "you do not have access to this resource"){
        super(message, 403)
    }
}

export class BadRequestException extends HttpException {
    constructor(data?: any, message?: string){
        super(message || "bad request", 400, data)
    }
}

export class Internal extends HttpException {
    constructor(data?: any, message?: string){
        super(message || "bad request", 400, data)
    }
}

export class TooManyRequestsException extends HttpException {
    constructor(message?: string){
        super(message || "too many requests", 422)
    }
}

export const GlobalErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global Error Handler:', err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    data: err.data
  })
}