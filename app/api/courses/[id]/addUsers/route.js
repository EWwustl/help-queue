import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';
import User from '@/app/(models)/User';

export async function POST(req, { params }) {
    await connectDB();

    const { id } = params;
    const { name, email, role } = await req.json();

    try {
        // find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email });
            await user.save();
        }

        // find the course
        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json({ error: `Course with id '${id}' not found` }, { status: 404 });
        }

        // check if the user already has a role
        if (course.students.includes(user._id) || course.tas.includes(user._id) || course.instructors.includes(user._id)) {
            const existingRole = course.students.includes(user._id) ? 'student' : course.tas.includes(user._id) ? 'ta' : 'instructor';
            return NextResponse.json({ error: `User '${user.email}' already has role '${existingRole}'. Add user failed.` }, { status: 400 });
        }

        // add user to the new role
        course[`${role}s`].push(user._id);

        await course.save();

        return NextResponse.json({ message: 'User added to course successfully' });
    } catch (error) {
        console.error('Error adding user to course:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}
