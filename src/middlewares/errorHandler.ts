import { NextFunction, Request, Response } from 'express';
import { BaseError } from '../utils/BaseError';
import httpStatus from 'http-status';
import { NotFoundError } from '../utils/NotFoundError';

export async function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof NotFoundError) {
    const serializeErrors = error.serializeErrors();
    return res.status(error.httpStatusCode).json({ errors: serializeErrors });
  }
  if (error instanceof BaseError) {
    const serializeErrors = error.serializeErrors();
    return res.status(error.httpStatusCode).json({ errors: serializeErrors });
  }

  res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .json({ errors: [{ message: 'Something went wrong' }] });
}
