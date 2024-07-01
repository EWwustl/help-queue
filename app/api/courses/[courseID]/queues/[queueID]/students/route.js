import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';

// get all students in specified queue
export async function GET(req, { params }) {
    await connectDB();
    const { courseID, queueID } = params;

    try {
        const course = await Course.findById(courseID).populate('queues.students');
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const queue = course.queues.id(queueID);
        if (!queue) {
            return NextResponse.json({ error: 'Queue not found' }, { status: 404 });
        }

        return NextResponse.json({ students: queue.students });
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}

// put specified students in specified queue
export async function POST(req, { params }) {
    await connectDB();
    const { courseID, queueID } = params;
    const { userID } = await req.json();

    try {
        const course = await Course.findById(courseID);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const queue = course.queues.id(queueID);
        if (!queue) {
            return NextResponse.json({ error: 'Queue not found' }, { status: 404 });
        }

        if (!queue.students.includes(userID)) {
            queue.students.push(userID);
            await course.save();
        }

        return NextResponse.json({ queue });
    } catch (error) {
        console.error('Error adding student to queue:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}

// remove specified student from specified queue
export async function DELETE(req, { params }) {
    await connectDB();
    const { courseID, queueID } = params;
    const { userID } = await req.json();

    try {
        const course = await Course.findById(courseID);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const queue = course.queues.id(queueID);
        if (!queue) {
            return NextResponse.json({ error: 'Queue not found' }, { status: 404 });
        }

        queue.students.pull(userID);
        await course.save();

        return NextResponse.json({ queue });
    } catch (error) {
        console.error('Error removing student from queue:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}
