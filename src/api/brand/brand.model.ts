import mongoose, { Schema } from 'mongoose';

export interface IBrand extends mongoose.Document {
  name: string;
  description: string;
  companyId: mongoose.ObjectId;
  logo?: string;
  merchantId?: string;
}

const brandSchema = new mongoose.Schema<IBrand>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'company', required: true },
    logo: { type: String },
    merchantId: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model('brands', brandSchema);
