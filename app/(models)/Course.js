import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

function generateJoinCode(length = 12) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let joinCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        joinCode += characters[randomIndex];
    }
    return joinCode;
}

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    studentJoinCode: { type: String, unique: true, immutable: true, default: () => generateJoinCode() },
    taJoinCode: { type: String, unique: true, immutable: true, default: () => generateJoinCode() },
    instructorJoinCode: { type: String, unique: true, immutable: true, default: () => generateJoinCode() },
    users: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['student', 'ta', 'instructor'], required: true }
    }],
    queues: [QueueSchema],
});

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

export default Course;
