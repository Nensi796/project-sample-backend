import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGE, USER_ROLE } from '@utils/constants';
import Users, { IUser } from '@api/users/user.model';

/**
 * Validate Auth token
 *
 * @param req
 * @param res
 * @param {object} next The next object
 **/
export const validateAuth = async (req, res, next) => {
  try {
    // Allow when create a super admin user
    if (
      !req.header('auth') &&
      req.originalUrl
        .toLowerCase()
        .includes('/v1/users/signup'.toLowerCase()) &&
      req.body.role === USER_ROLE.MANAGER
    ) {
      next();
    } else if (req.headers['authorization']) {
      try {
        const authorization = req.headers['authorization'].split(' ');
        if (authorization[0] !== 'Bearer') {
          return res
            .status(httpStatus.UNAUTHORIZED)
            .send(ERROR_MESSAGE.INVALID_TOKEN); //invalid request
        } else {
          const tokenData: any = jwt.verify(
            authorization[1],
            process.env.JWT_TOKEN_SECRET,
          );
          const user: IUser = await Users.findOne({
            _id: tokenData?.user?.id,
            isDeleted: false,
          });
          if (!user || !user?._id) {
            return res.status(httpStatus.UNAUTHORIZED).json('Unauthorized');
          }
          req.user = user;
          return next();
        }
      } catch (err) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send(ERROR_MESSAGE.INVALID_TOKEN); //invalid token
      }
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send(ERROR_MESSAGE.REQUIRE_TOKEN);
    }
  } catch (err) {
    console.log(
      'Auth Middleware : User Authentication Error in Authentication: ' + err,
    );
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(ERROR_MESSAGE.GENERIC_AUTHENTICATION_CHECK_ERROR);
  }
};
