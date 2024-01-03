import httpStatus from 'http-status';
import { authenticator } from 'otplib';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import { catchAsync } from '@utils/catchAsync';
import { APIError } from '@utils/APIError';
import { ERROR_MESSAGE, ListSortOrder, USER_ROLE } from '@utils/constants';
import { LooseObject } from '@src/types';
import Users, { IUser } from '@api/users/user.model';
import { errorResponse, successResponse } from '@utils/response';
import usersFindOne from '@operations/users/findOne';
import createNewUser from '@operations/users/createOne';
import usersUpdateOne from '@operations/users/updateOne';
import {
  invalidPasswordError,
  isValidEmailError,
  userDoesNotExistsError,
  userIsNotVerifiedError,
} from './user.error';
import { checkUser, activeUser } from './user.service';
import { signToken } from './user.authJWT';
import { sendSignupEmail } from '@services/email/sendSignupEmail';
import { sendResetPasswordEmail } from '@services/email/sendResetPasswordEmail';
import usersFindManyPagination from '@operations/users/findManyPagination';
import usersCountDocuments from '@operations/users/countDocuments';
import createNewPermission from '@operations/permissions/createOne';
import groupsFindOne from '@operations/groups/findOne';
import Permission from '@api/permissions/permission.model';

const saltRounds = 10;

// Create a new company user
export const createCompanyAdmin = catchAsync(
  async (req, res): Promise<void> => {
    const { email, role } = req.body;

    req.body.createdBy = req.user._id;
    await createNewUser({ ...req.body });
    const token = jwt.sign({ email, role }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: parseInt(process.env.SIGNUP_LINK_EXPIRES),
    });
    const redirectUrl = '/validate-signup-token';
    await sendSignupEmail(email, token, redirectUrl);
    return res
      .status(httpStatus.OK)
      .json(successResponse(`Verification email sent to: ${email}`, {}));
  },
);

export const getCompanyUsers = catchAsync(async (req, res): Promise<void> => {
  const { sort, companyId, offset, limit } = req.body;

  if (!companyId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('CompanyId is required', {}));
  }

  let defaultSort: LooseObject = {
    name: ListSortOrder.ASC,
  };

  if (sort) {
    defaultSort = {
      [sort.fieldName]: sort.order,
    };
  }

  const userData = await usersFindManyPagination(
    { isDeleted: false },
    offset,
    limit,
    defaultSort,
  );

  const count = await usersCountDocuments({
    company: companyId,
    isDeleted: false,
  });

  if (userData.length == 0) {
    return res
      .status(httpStatus.OK)
      .json(successResponse('No Users Found', { users: [], count }));
  }

  return res.status(httpStatus.OK).json(
    successResponse('Successfully', {
      users: userData,
      count,
    }),
  );
});

export const inviteUser = catchAsync(async (req, res): Promise<void> => {
  const {
    group,
    isCustomGroup,
    pageAreasPermissions = [],
    brandsPermissions = [],
  } = req.body;
  const email = req.body.email;
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user.name;

  if (isCustomGroup) {
    const payload = {
      pageAreasPermissions,
      brandsPermissions,
    };
    const permissionDetails = await createNewPermission(payload);
    req.body.permissionId = permissionDetails._id;
  } else {
    const groupData = await groupsFindOne({
      _id: group,
      isDeleted: false,
    });
    if (!groupData) {
      return res.status(httpStatus.BAD_REQUEST).json(
        errorResponse('Group does not exist', {
          isSuccess: false,
        }),
      );
    }
    req.body.permissionId = groupData.permissionId;
  }

  const newUser = await createNewUser({ ...req.body });
  const token = jwt.sign(
    { email, id: newUser?._id, role: USER_ROLE.USER },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: parseInt(process.env.SIGNUP_LINK_EXPIRES),
    },
  );
  const redirectUrl = '/validate-signup-token';
  await sendSignupEmail(email, token, redirectUrl);
  return res
    .status(httpStatus.OK)
    .json(successResponse(`Verification email sent to: ${email}`, { token }));
});

// Create a new password after verify email
export const setPassword = catchAsync(async (req, res): Promise<void> => {
  const user: IUser = await checkUser(req.body);
  if (!user) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse(ERROR_MESSAGE.USER_NOT_EXISTS, {}));
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const updatedUser = await Users.findOneAndUpdate(
      { _id: user._id },
      { password: hashedPassword, resetPasswordToken: '' },
      { select: 'name email role' },
    );
    const secret = authenticator.generateSecret();
    const token = signToken(user);
    await Users.findOneAndUpdate(
      { _id: user._id },
      { $set: { isFirstLogin: false, secret } },
    );
    QRCode.toDataURL(
      authenticator.keyuri(req.body.email, '2FA Node App', secret),
      (err, url) => {
        if (err) {
          console.log(err);
          throw err;
        }
        return res.status(httpStatus.OK).json({
          token,
          isSuccess: true,
          qr: url,
          user: updatedUser,
          errors: null,
        });
      },
    );
  } catch (error) {
    throw new Error(error);
  }
});

// Validate signup token
export const verifySignupToken = catchAsync(async (req, res): Promise<void> => {
  const { token } = req.body;
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json(
      errorResponse(ERROR_MESSAGE.REQUIRE_TOKEN, {
        isValid: false,
      }),
    );
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET) as any;
    const { email } = payload;
    const user = await activeUser(email, {
      isVerified: true,
    });
    return res.status(httpStatus.OK).json(
      successResponse('Successfully Verified', {
        isValid: true,
        user,
      }),
    );
  } catch (err) {
    if (err.message === 'jwt expired') {
      const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET, {
        ignoreExpiration: true,
      }) as any;

      const email = payload.email as string;

      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
        errorResponse(err.message || ERROR_MESSAGE.SOMETHING_WENT_WRONG, {
          isValid: false,
          message: err.message,
          email,
        }),
      );
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      errorResponse(err.message || ERROR_MESSAGE.SOMETHING_WENT_WRONG, {
        isValid: false,
        message: err.message,
      }),
    );
  }
});

// For login
export const signIn = catchAsync(async (req, res): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIError(
      'Email and password is required',
      'getSignupUser',
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  let userConditions: LooseObject = {};

  const userAndConditions: LooseObject = [
    {
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false },
        { isDeleted: null },
      ],
    },
    {
      email: RegExp(
        '^' + email.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$',
        'i',
      ),
    },
  ];

  userConditions = {
    $and: userAndConditions,
  };

  const user: IUser = await usersFindOne(userConditions);

  const doesUserExistError = userDoesNotExistsError(user); // user is not in db error

  if (!user) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      isSuccess: false,
      user: null,
      errors: [doesUserExistError],
    });
  }

  const errors = [
    isValidEmailError(req.body),
    doesUserExistError,
    !doesUserExistError && (await invalidPasswordError(password, user)), // user password does not match
    !doesUserExistError && (await userIsNotVerifiedError(user)),
  ];

  const actualErrors = errors.filter((error) => error);

  if (actualErrors.length > 0) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      isSuccess: false,
      user: null,
      errors: actualErrors,
    });
  }

  const secret = authenticator.generateSecret();
  const token = signToken(user);
  {
    return res.status(httpStatus.OK).json({
      isSuccess: true,
      successMessage: 'Successfully Verified',
      errors: null,
      token,
    });
  }
});

export const getCurrentUser = catchAsync(async (req, res): Promise<void> => {
  try {
    const user = await Users.findOne(
      { _id: req.user._id },
      {
        isDeleted: 0,
        isVerified: 0,
        isFirstLogin: 0,
        password: 0,
        secret: 0,
        resetPasswordToken: 0,
        __v: 0,
      },
    );
    return res.status(httpStatus.OK).json(
      successResponse('Successfully', {
        isSuccess: true,
        user,
      }),
    );
  } catch (error) {
    throw new Error(error);
  }
});

// Validate Google Auth OTP
export const verifyOtp = catchAsync(async (req, res): Promise<void> => {
  const { code } = req.body;

  // Validate auth code
  if (!authenticator.check(code, req.user?.secret)) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      errorResponse('Invalid Code', {
        isSuccess: false,
      }),
    );
  }

  const user: IUser = await Users.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { lastLogin: Date.now() } },
    { select: 'name email role phone role createdAt company' },
  );

  // After verified generate signIn token
  const token = signToken(req.user);

  return res.status(httpStatus.OK).json(
    successResponse('Successfully', {
      isSuccess: true,
      token,
      user,
    }),
  );
});

// Forgot password
export const forgotPassword = catchAsync(async (req, res): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse('email is required', {}));
  }
  try {
    const user: IUser = await usersFindOne({
      email: RegExp(
        '^' + email.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$',
        'i',
      ),
      isDeleted: false,
    });
    if (user) {
      const token = jwt.sign(
        {
          user: { email, id: user._id },
        },
        process.env.JWT_TOKEN_SECRET,
        {
          expiresIn: '15m',
        },
      );
      ``;
      await sendResetPasswordEmail(email, token);
      await usersUpdateOne(
        { _id: user._id },
        { resetPasswordToken: token, isVerified: false },
      );
      return res.status(httpStatus.OK).json(
        successResponse(`Successfully send mail to ${email}`, {
          isSuccess: true,
        }),
      );
    } else {
      return res.status(httpStatus.BAD_REQUEST).json(
        errorResponse(ERROR_MESSAGE.USER_NOT_EXISTS, {
          isSuccess: false,
        }),
      );
    }
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          'Something went wrong, please try again or contact support',
          { isSuccess: false },
        ),
      );
  }
});

export const verifyResetToken = catchAsync(async (req, res): Promise<void> => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse(ERROR_MESSAGE.REQUIRE_TOKEN, {}));
  }
  try {
    const payload: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    if (!payload) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
        errorResponse(ERROR_MESSAGE.INVALID_TOKEN, {
          isValid: false,
          isExpired: false,
        }),
      );
    }
    const id = payload.user.id;
    const user = await usersFindOne({ _id: id, isDeleted: false });

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      errorResponse(ERROR_MESSAGE.INVALID_TOKEN, {
        isValid: false,
        isExpired: false,
      }),
    );
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      errorResponse(error.message || ERROR_MESSAGE.INVALID_TOKEN, {
        isValid: false,
        isExpired: false,
      }),
    );
  }
});

export const resetPassword = catchAsync(async (req, res): Promise<void> => {
  const { password, token } = req.body;
  if (!password || !token) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse('password and token are required', {}));
  }
  try {
    const payload: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    if (!payload) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
        errorResponse(ERROR_MESSAGE.INVALID_TOKEN, {
          isValid: false,
          isExpired: false,
        }),
      );
    }
    const id = payload.user.id;
    const user = await usersFindOne({ _id: id, isDeleted: false });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updatedUser = await usersUpdateOne(
      { _id: user._id },
      { password: hashedPassword, isVerified: true, resetPasswordToken: '' },
    );
    if (updatedUser)
      return res.status(httpStatus.OK).json(
        successResponse('Successfully Updated', {
          isSuccess: true,
        }),
      );
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      errorResponse(ERROR_MESSAGE.SOMETHING_WENT_WRONG, {
        isValid: false,
        isExpired: false,
      }),
    );
  }
});

export const updateUserDetail = catchAsync(async (req, res): Promise<void> => {
  try {
    const { isCustomGroup, pageAreasPermissions, brandsPermissions, group } =
      req.body;
    const user = await usersFindOne({ _id: req?.body?.id, isDeleted: false });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json(
        errorResponse(ERROR_MESSAGE.USER_NOT_EXISTS, {
          isSuccess: false,
        }),
      );
    }
    req.body.updatedBy = req?.user?.name;

    if (isCustomGroup) {
      const payload = {
        pageAreasPermissions,
        brandsPermissions,
      };
    } else {
      const groupData = await groupsFindOne({
        _id: group,
        isDeleted: false,
      });
      if (!groupData) {
        return res.status(httpStatus.BAD_REQUEST).json(
          errorResponse('Group does not exist', {
            isSuccess: false,
          }),
        );
      }
      req.body.permissionId = groupData.permissionId;
    }

    await usersUpdateOne({ _id: user._id }, { $set: { ...req.body } });
    return res.status(httpStatus.OK).json(
      successResponse('Successfully Updated', {
        isSuccess: true,
      }),
    );
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      errorResponse(ERROR_MESSAGE.SOMETHING_WENT_WRONG, {
        isSuccess: false,
      }),
    );
  }
});

export const deleteUser = catchAsync(async (req, res): Promise<void> => {
  if (!req.body?.userId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('UserId is required', {}));
  }

  try {
    const user = await usersFindOne({
      _id: req.body?.userId,
      isDeleted: false,
    });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json(
        errorResponse(ERROR_MESSAGE.USER_NOT_EXISTS, {
          isSuccess: false,
        }),
      );
    }

    await usersUpdateOne(
      { _id: req.body.userId },
      { $set: { isDeleted: true } },
    );
    return res.status(httpStatus.OK).json(
      successResponse('Successfully Deleted', {
        isSuccess: true,
      }),
    );
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      errorResponse(ERROR_MESSAGE.SOMETHING_WENT_WRONG, {
        isSuccess: false,
      }),
    );
  }
});
