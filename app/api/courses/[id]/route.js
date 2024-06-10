import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';

export async function GET(req, { params }) {
    try {
        await connectDB();

        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req, secret });

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
