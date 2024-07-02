import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';

// delete specified user from specified course
export async function DELETE(req, { params }) {
    await connectDB();

    const { courseID, userID } = params;

    try {
        const course = await Course.findById(courseID);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        course.users.pull({ user: userID });
        await course.save();

        return NextResponse.json({ message: 'User removed from course successfully' });
    } catch (error) {
        console.error('Error removing user:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}

// update specified user's role in specified course
export async function PATCH(req, { params }) {
    await connectDB();

    const { courseID, userID } = params;
    const { role } = await req.json();

    try {
        const course = await Course.findById(courseID);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const userInCourse = course.users.find(u => u.user.toString() === userID);
        if (!userInCourse) {
            return NextResponse.json({ error: 'User not found in course' }, { status: 404 });
        }

        userInCourse.role = role;

        await course.save();

        return NextResponse.json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}
