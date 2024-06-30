import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';

// get all courses
export async function GET(req) {
    try {
        await connectDB();

        let courses;
        courses = await Course.find();

        return NextResponse.json({ courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}

// create a new course with specified name
export async function POST(req) {
    try {
        await connectDB();

        const { name } = await req.json();

        const newCourse = new Course({ name });
        await newCourse.save();

        return NextResponse.json({ course: newCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}
