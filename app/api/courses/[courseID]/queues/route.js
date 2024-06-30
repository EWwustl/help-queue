import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';

// get all queues in specified course
export async function GET(req, { params }) {
    await connectDB();
    const { courseID } = params;

    try {
        const course = await Course.findById(courseID).select('queues');
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ queues: course.queues });
    } catch (error) {
        console.error('Error fetching queues:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}

// create a new queue in specified course
export async function POST(req, { params }) {
    await connectDB();
    const { courseID } = params;
    const { name } = await req.json();

    try {
        const course = await Course.findById(courseID);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // check for existing queue with the same name
        const queueInCourse = course.queues.find(queue => queue.name === name);
        if (queueInCourse) {
            return NextResponse.json({ error: 'Queue with this name already exists' }, { status: 400 });
        }

        course.queues.push({ name });
        await course.save();

        return NextResponse.json({ queues: course.queues });
    } catch (error) {
        console.error('Error adding queue:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}