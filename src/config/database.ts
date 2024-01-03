import mongoose, { ConnectOptions } from 'mongoose';

const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log('MongoDB connected!');
  } catch (err) {
    console.error(err);
  }
};

const disconnect = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected!');
  } catch (err) {
    console.error(err);
  }
};

export default { connect, disconnect };
