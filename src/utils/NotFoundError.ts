import httpStatus from 'http-status';
import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(message = 'Resource Not Found') {
    super(message, '', httpStatus.NOT_FOUND);
  }
  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
