import connectDB from "@/app/(lib)/mongoose";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import User from "@/app/(models)/User";

const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];

const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session }) {
            await connectDB();

            let existingUser = await User.findOne({ email: session.user.email });

            if (!existingUser) {
                existingUser = await User.create({ name: session.user.name, email: session.user.email });
            }

            if (adminEmails.includes(session.user.email)) {
                session.user.role = 'admin';
            } else {
                session.user.role = 'user';
            }

            session.user.id = existingUser._id;
            session.user.name = existingUser.name

            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
