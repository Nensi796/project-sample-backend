import mongoose from 'mongoose';

export interface IPageArea extends mongoose.Document {
  name: string;
  value: string;
}

const pageAreaSchema = new mongoose.Schema<IPageArea>(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('pageAreas', pageAreaSchema);
