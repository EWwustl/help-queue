import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';

// get all courses the specified user has joined
export async function GET(req, { params }) {
    await connectDB();

    const { userID } = params;

    try {
        const courses = await Course.find({ 'users.user': userID });

        return NextResponse.json({ courses });
    } catch (error) {
        console.error('Error fetching joined courses:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}

// put specified user in course based on join code
export async function POST(req, { params }) {
    await connectDB();

    const { userID } = params;
    const { joinCode } = await req.json();
    if (!joinCode) {
        return NextResponse.json({ error: 'Join code is required' }, { status: 400 });
    }

    try {
        // find a course based on the join code
        const course = await Course.findOne({
            $or: [
                { studentJoinCode: joinCode },
                { taJoinCode: joinCode },
                { instructorJoinCode: joinCode }
            ]
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        let role;
        switch (joinCode) {
            case course.studentJoinCode:
                role = 'student';
                break;
            case course.taJoinCode:
                role = 'ta';
                break;
            case course.instructorJoinCode:
                role = 'instructor';
                break;
            default:
                // should never happen, just for switch statement's grammar
                return NextResponse.json({ error: 'Invalid join code' }, { status: 400 });
        }

        const userInCourse = course.users.find(u => u.user.toString() === userID);
        if (userInCourse) {
            userInCourse.role = role; // update the role
        } else {
            course.users.push({ user: userID, role });
        }

        await course.save();

        return NextResponse.json({ message: `Successfully joined '${course.name}' as '${role}'` });
    } catch (error) {
        console.error('Error joining course:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}
