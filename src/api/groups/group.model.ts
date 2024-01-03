import mongoose, { Schema } from 'mongoose';

export interface IGroup extends mongoose.Document {
  name: string;
  description: string;
  isDeleted: boolean;
  permissionId: mongoose.ObjectId;
}

const groupSchema = new mongoose.Schema<IGroup>(
  {
    name: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    permissionId: {
      type: Schema.Types.ObjectId,
      ref: 'permissions',
    },
  },
  { timestamps: true },
);

export default mongoose.model('groups', groupSchema);
