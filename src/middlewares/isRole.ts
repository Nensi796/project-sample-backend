import httpStatus from 'http-status';
import { ERROR_MESSAGE, USER_ROLE } from '@utils/constants';

/**
 * Check Super Admin
 *
 * @param req
 * @param res
 * @param {object} next The next object
 **/
export const isSuperAdmin = (req, res, next) => {
  try {
    if (
      req.originalUrl
        .toLowerCase()
        .includes('/v1/users/signup'.toLowerCase()) &&
      req.body.role === USER_ROLE.MANAGER
    ) {
      return next();
    }
    if (!req?.user?.role || req?.user?.role !== USER_ROLE.MANAGER) {
      return res.status(httpStatus.UNAUTHORIZED).json('User Unauthorized');
    }
    return next();
  } catch (err: unknown) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Check Company Admin
 *
 * @param req
 * @param res
 * @param {object} next The next object
 **/
export const isAdmin = (req, res, next) => {
  try {
    if (
      req?.user?.role &&
      req?.user?.role === USER_ROLE.MANAGER )
    {
      return next();
    }
    return res.status(httpStatus.UNAUTHORIZED).json('User Unauthorized');
  } catch (err: unknown) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  }
};
