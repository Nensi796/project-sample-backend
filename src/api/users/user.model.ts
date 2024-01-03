import mongoose, { Schema } from 'mongoose';
import { USER_ROLE } from '@utils/constants';

export interface IUser extends mongoose.Document {
  username?: string;
  email: string;
  password?: string;
  department?: string;

  role: USER_ROLE;

  isDeleted: boolean;

  createdBy: mongoose.ObjectId;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },

    department: { type: String },

    role: {
      type: String,
      enum: [USER_ROLE.MANAGER, USER_ROLE.EMP],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('users', userSchema);
