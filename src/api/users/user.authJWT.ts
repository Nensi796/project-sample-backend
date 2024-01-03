import jwt from 'jsonwebtoken';
import { IUser } from '@api/users/user.model';

export const signToken = (
  user: IUser,
  signOptions = { expiresIn: '30d' },
): string => {
  const JWT_SECRET = process.env.JWT_TOKEN_SECRET;
  const token = jwt.sign(
    {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        company: user?.company,
      },
    },
    JWT_SECRET,
    signOptions,
  );
  return token;
};
