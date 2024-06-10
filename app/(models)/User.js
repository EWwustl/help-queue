import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['instructor', 'TA'], required: true },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
