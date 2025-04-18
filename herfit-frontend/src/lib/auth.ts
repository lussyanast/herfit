import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24, // 1 day
    },
    pages: {
        signIn: "/sign-in",
    },
    providers: [
        Credentials({
            credentials: {
                id: { type: "number" },
                email: { type: "text" },
                name: { type: "text" },
                token: { type: "text" },
                photo_profile: { type: "text" },
            },
            authorize: async (credentials, req) => {
                return credentials || null;
            },
        }),
    ],
    callbacks: {
        jwt: async ({ user, token }) => {
            if (user) {
                token.id = +user.id;
                token.name = user.name;
                token.email = user.email;
                token.token = user.token;
                token.photo_profile = user.photo_profile;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.id as number;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.token = token.token as string;
                session.user.photo_profile = token.photo_profile as string;
            }
            return session;
        },
    },
};
