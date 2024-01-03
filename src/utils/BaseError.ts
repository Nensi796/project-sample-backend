export abstract class BaseError extends Error {
  httpStatusCode: number;
  methodName: string;
  constructor(message: string, methodName?: string, httpStatusCode?: number) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.methodName = methodName;
    Object.setPrototypeOf(this, new.target.prototype);
  }
  abstract serializeErrors(): { message: string; field?: string }[];
}
