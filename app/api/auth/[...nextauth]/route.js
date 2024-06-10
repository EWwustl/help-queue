import connectDB from "@/app/(lib)/mongoose";
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import User from "@/app/(models)/User";

const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            await connectDB();

            const dbUser = await User.findOne({ email: session.user.email });

            if (dbUser) {
                session.user.role = dbUser.role;
            } else {
                session.user.role = 'student';
            }

            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };