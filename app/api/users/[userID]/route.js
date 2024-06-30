import { NextResponse } from 'next/server';
import connectDB from '@/app/(lib)/mongoose';
import User from '@/app/(models)/User'

// update specified user's role in specified course
export async function PATCH(req, { params }) {
    await connectDB();

    const { userID } = params;
    const { name } = await req.json();

    try {
        const user = await User.findByIdAndUpdate(userID, { name });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}