import mongoose, { Schema } from 'mongoose';

export interface ICompany extends mongoose.Document {
  name: string;
  brands?: string[];
  description?: string;
  logo?: string;
  isDeleted: boolean;
}

const companySchema = new mongoose.Schema<ICompany>(
  {
    name: { type: String, required: true },
    brands: [
      {
        type: Schema.Types.ObjectId,
        ref: 'brands',
      },
    ],
    description: { type: String },
    logo: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model('company', companySchema);
