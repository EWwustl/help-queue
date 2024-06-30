import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';
import User from '@/app/(models)/User';

// get all users in specified course
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

// create/put user(s) in specified course
export async function POST(req, { params }) {
    await connectDB();

    const { courseID } = params;
    const { users } = await req.json();

    if (!Array.isArray(users) || users.length === 0) {
        return NextResponse.json({ error: 'Invalid or empty users array' }, { status: 400 });
    }

    try {
        const course = await Course.findById(courseID);
        if (!course) {
            return NextResponse.json({ error: `Course with id '${courseID}' not found` }, { status: 404 });
        }

        const errors = [];

        for (const userData of users) {
            if (!userData.name || !userData.email) {
                errors.push(`Invalid user data: ${JSON.stringify(userData)}`);
                continue;
            }

            try {
                // find or create user
                let user = await User.findOne({ email: userData.email });
                if (!user) {
                    user = new User({ name: userData.name, email: userData.email });
                    await user.save();
                }

                // only add user if they are not in the course yet
                const userInCourse = course.users.find(u => u.user.toString() === user._id.toString());
                if (userInCourse) {
                    errors.push(`User '${userData.email}' already has role '${userInCourse.role}'.`);
                } else {
                    course.users.push({ user: user._id, role: userData.role });
                }
            } catch (err) {
                console.error(`Error processing user ${userData.email}:`, err);
                errors.push(`Error processing user ${userData.email}: ${err.message}`);
            }
        }

        await course.save();

        if (errors.length > 0) {
            return NextResponse.json({ message: 'Adding users resulted in some errors', errors }, { status: 207 }); // 207 means mixture of results
        } else {
            return NextResponse.json({ message: 'All users added successfully' });
        }
    } catch (error) {
        console.error('Error adding users to course:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}