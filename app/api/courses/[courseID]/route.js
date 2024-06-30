import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';

// get specified course
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { courseID } = params;
        const course = await Course.findById(courseID);

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ course });
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}

// delete specified course
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { courseID } = params;
        await Course.findByIdAndDelete(courseID);

        return NextResponse.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}

// update speficied course's name
export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const { courseID } = params;
        const { name } = await req.json();

        const course = await Course.findByIdAndUpdate(courseID, { name }, { new: true });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ course });
    } catch (error) {
        console.error('Error updating course:', error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}