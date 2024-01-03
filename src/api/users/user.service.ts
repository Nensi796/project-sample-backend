import Users, { IUser } from '@api/users/user.model';
import usersFindOne from '@operations/users/findOne';

// Check user.
export const checkUser = async (input) => {
  try {
    return await Users.findOne({ email: input.email });
  } catch (error) {
    throw new Error(error);
  }
};

// For activate new user.
export const activeUser = async (email, query) => {
  const user: IUser = await usersFindOne({ email });
  if (!user) {
    throw new Error('Not found user');
  }
  if (user.isVerified) {
    throw new Error('User already isVerified');
  }
  const updateUser: IUser = await Users.findOneAndUpdate(
    { _id: user.id },
    { $set: query },
  );
  return updateUser;
};
