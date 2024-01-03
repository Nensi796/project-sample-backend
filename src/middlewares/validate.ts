import { ExpressValidator } from 'express-validator';
import httpStatus from 'http-status';
import { ERROR_MESSAGE } from '@utils/constants';

const { validationResult } = new ExpressValidator();

export const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      status: httpStatus.UNPROCESSABLE_ENTITY,
      message: ERROR_MESSAGE.UNPROCESSABLE_ENTITY,
      errors: errors.array(),
    });
  };
};
