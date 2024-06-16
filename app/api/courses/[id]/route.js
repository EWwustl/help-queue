import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const course = await Course.findById(id);

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ course });
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id } = params;
        await Course.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const { name } = await req.json();

        const course = await Course.findByIdAndUpdate(id, { name }, { new: true });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ course });
    } catch (error) {
        console.error('Error updating course:', error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}