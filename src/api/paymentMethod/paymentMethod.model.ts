import mongoose from 'mongoose';

export interface IPaymentMethod extends mongoose.Document {
  type: string;
  logo: string;
  name: string;
  description: string;
}

const paymentMethodSchema = new mongoose.Schema<IPaymentMethod>(
  {
    type: { type: String, required: true },
    logo: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('paymentMethods', paymentMethodSchema);
