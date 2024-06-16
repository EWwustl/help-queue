import connectDB from "@/app/(lib)/mongoose";
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import User from "@/app/(models)/User";

connectDB();

// convert ADMIN_EMAILS into an array
const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];

const auth_options = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            // check if the user exists in the database
            if (user) {
                let existingUser = await User.findOne({ email: user.email });

                // if user does not exist, create a new user
                if (!existingUser) {
                    existingUser = await User.create({ name: user.name, email: user.email });
                }

                // check if the user's email is in the admin list
                if (adminEmails.includes(user.email)) {
                    token.role = 'admin';
                } else {
                    token.role = 'user';
                }

                // attach the user id to the token
                token.id = existingUser._id;
            }

            return token;
        },
        async session({ session, token }) {
            // assign user role and id based on the token
            session.user.role = token.role;
            session.user.id = token.id;
            return session;
        },
    },
};

const handler = NextAuth(auth_options);

export { handler as GET, handler as POST };