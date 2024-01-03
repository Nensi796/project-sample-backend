import { BaseError } from './BaseError';

export class APIError extends BaseError {
  constructor(message: string, methodName: string, httpStatusCode: number) {
    super(message, methodName, httpStatusCode);
  }
  serializeErrors(): {
    message: string;
    methodName?: string;
    httpStatusCode: number;
    stack: string;
  }[] {
    const errorResponse = {
      message: this.message,
      methodName: this.methodName,
      httpStatusCode: this.httpStatusCode,
      stack: '',
    };
    if (process.env.NODE_ENV == 'development') {
      errorResponse.stack = this.stack;
    }
    delete errorResponse.stack;
    return [errorResponse];
  }
}
