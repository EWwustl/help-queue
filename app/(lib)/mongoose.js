import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
    throw new Error('Please add your MONGODB_URL to .env.local');
}

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    return mongoose.connect(MONGODB_URL);
};

export default connectDB;
