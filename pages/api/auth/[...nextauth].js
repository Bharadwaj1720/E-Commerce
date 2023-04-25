// // pages/api/auth/[...nextauth].js
// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import FacebookProvider from "next-auth/providers/facebook";
// import GitHubProvider from "next-auth/providers/github";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
// import clientPromise from "../../../lib/mongodb"




// export default NextAuth({
//     adapter: MongoDBAdapter(clientPromise),
//     secret: process.env.SECRET,
//     session: {
//         jwt: true
//     },
//     providers: [
//         // OAuth authentication providers
//         GoogleProvider({
//             clientId: process.env.GOOGLE_ID,
//             clientSecret: process.env.GOOGLE_SECRET,
//         }),
//         GitHubProvider({
//             clientId: process.env.GITHUB_ID,
//             clientSecret: process.env.GITHUB_SECRET
//         }),
//         FacebookProvider({
//             clientId: process.env.FACEBOOK_CLIENT_ID,
//             clientSecret: process.env.FACEBOOK_CLIENT_SECRET
//         }),
//     ],
//     callbacks: {
//         session: async (session, user) => {
//             session.user.username = "Bharadwaj";
//             session.user.x = "asd";
//             session.user.c = "dg";
//             session.user.d = "hrt";
//             return Promise.resolve(session);
//         },
//     },

//     pages: {
//         signIn: "/login"
//     },
//     // database: process.env.DATABASE_URL,
// })




import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../models/User';
import db from '../../../utils/mongodb';
import fs from 'fs';




export default NextAuth({
    session: {
        strategy: 'jwt',
        //strategy:'database'

    },
    callbacks: {
        async jwt({ token, user }) {
            if (user?._id) token._id = user._id;
            if (user?.isAdmin) token.isAdmin = user.isAdmin;
            if (user?.isSeller) token.isSeller = user.isSeller;

            return token;
        },
        async session({ session, token }) {
            if (token?._id) session.user._id = token._id;
            if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
            if (token?.isSeller) session.user.isSeller = token.isSeller;

            return session;
        },
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                await db.connect();
                const user = await User.findOne({
                    email: credentials.email,
                });
                await db.disconnect();
                if (user && bcryptjs.compareSync(credentials.password, user.password)) {
                    const info = {
                        name: user.name,
                        email: user.email,
                    };
                    const jsonString = JSON.stringify(info);
                    fs.writeFile('./temp.json', jsonString, err => {
                        if (err) {
                            console.log('Error writing file', err)
                        }
                    })
                    return {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        image: 'f',
                        isAdmin: user.isAdmin,
                        isSeller: user.isSeller,
                    };
                }
                throw new Error('Invalid email or password');
            },
        }),
    ],
});