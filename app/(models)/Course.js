import mongoose from 'mongoose';

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
});

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

export default Course;
