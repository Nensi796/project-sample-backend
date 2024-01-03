import bcrypt from 'bcryptjs';
import { Error } from '@src/types';
import { isEmail } from '@utils/common';
import usersUpdateOne from '@operations/users/updateOne';
import { IUser } from './user.model';

// Check if valid email string.
export const isValidEmailError = ({ email }: { email: string }): Error => {
  if (!isEmail(email)) {
    return {
      message: 'This is not a valid email',
      code: 'NOT_VALID_EMAIL',
    };
  }
};

// Check if user exists in the database.
export const userDoesNotExistsError = (user: IUser): Error | undefined => {
  if (!user) {
    return {
      message: 'Invalid username or password',
      code: 'INVALID_USERNAME_OR_PASSWORD',
    };
  }
};

// Check if user has provided the correct password.
// Lock account for one hour on 5 wrong password tries.
export const invalidPasswordError = async (
  password: string,
  user: IUser,
): Promise<Error> => {
  const passwordDb = user.password;
  if (!password || !passwordDb) {
    return {
      message: 'Invalid username or password',
      code: 'USER_NOT_VALID_PASSWORD',
    };
  }

  const valid = bcrypt.compareSync(password, passwordDb);

  if (!valid) {
    return {
      message: 'Invalid username or password',
      code: 'INVALID_USERNAME_OR_PASSWORD',
    };
  } else {
    await usersUpdateOne(
      { _id: user.id },
      { accessFailedCount: 0, lockoutExpires: null, lockoutEnabled: false },
    );
  }
};

// Check if user email is verified or not.
export const userIsNotVerifiedError = async (user: IUser) => {
  const { isVerified } = user;
  if (!isVerified) {
    return {
      message: 'User is not verified',
      code: 'USER_EMAIL_UNVERIFIED',
    };
  }
};
