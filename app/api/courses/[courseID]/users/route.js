import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';
import User from '@/app/(models)/User';

export async function GET(req, { params }) {
    await connectDB();

    const { courseID } = params;

    try {
        // find the course and populate the users
        const course = await Course.findById(courseID).populate('users.user');
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // extract users with roles
        const users = course.users.map(u => ({
            user: u.user.toObject(),
            role: u.role
        }));

        // sort users by email
        users.sort((a, b) => a.user.email.localeCompare(b.user.email));

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}

export async function POST(req, { params }) {
    await connectDB();

    const { courseID } = params;
    const { name, email, role } = await req.json();

    try {
        // find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email });
            await user.save();
        }

        // find the course
        const course = await Course.findById(courseID);
        if (!course) {
            return NextResponse.json({ error: `Course with id '${courseID}' not found` }, { status: 404 });
        }

        const existingUser = course.users.find(u => u.user.toString() === user._id.toString());
        if (existingUser) {
            return NextResponse.json({ error: `User '${user.email}' already has role '${existingUser.role}'. Add user failed.` }, { status: 400 });
        } else {
            course.users.push({ user: user._id, role });
        }

        await course.save();

        return NextResponse.json({ message: 'User added to course successfully' });
    } catch (error) {
        console.error('Error adding user to course:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}
