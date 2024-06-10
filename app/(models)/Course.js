import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
});

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

export default Course;
