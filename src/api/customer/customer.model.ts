import mongoose from 'mongoose';

export interface ICustomer extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const customerSchema = new mongoose.Schema<ICustomer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('customers', customerSchema);
