import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/app/(lib)/mongoose';
import Course from '@/app/(models)/Course';

export async function GET(req) {
    try {
        await connectDB();

        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req, secret });

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let courses;
        if (token.role === 'student') {
            courses = await Course.find({ isActive: true });
        } else {
            courses = await Course.find();
        }

        return NextResponse.json({ courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}
