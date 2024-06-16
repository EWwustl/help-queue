import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/app/(lib)/mongoose';
import User from '@/app/(models)/User';

export async function POST(req) {
    try {
        await connectDB();

        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req, secret });

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, name } = await req.json();

        const user = await User.findByIdAndUpdate(id, { name });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}
