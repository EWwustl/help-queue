import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';

export async function DELETE(req, { params }) {
    await connectDB();
    const { courseID, queueID } = params;

    try {
        const course = await Course.findById(courseID);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        course.queues.pull(queueID);
        await course.save();

        return NextResponse.json({ course });
    } catch (error) {
        console.error('Error deleting queue:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    await connectDB();
    const { courseID, queueID } = params;

    try {
        const course = await Course.findById(courseID);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const queue = course.queues.id(queueID);
        if (!queue) {
            return NextResponse.json({ error: 'Queue not found' }, { status: 404 });
        }

        queue.isActive = !queue.isActive;
        queue.students = [];    // clear students in queue
        await course.save();

        return NextResponse.json({ course });
    } catch (error) {
        console.error('Error toggling queue status:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}
