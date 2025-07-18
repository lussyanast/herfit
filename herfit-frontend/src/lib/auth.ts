import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24,
    },
    providers: [
        Credentials({
            credentials: {
                id: { type: "number" },
                email: { type: "text" },
                nama_lengkap: { type: "text" },
                foto_profil: { type: "text" },
                token: { type: "text" },
            },
            authorize: async (credentials) => {
                if (!credentials) return null;

                const id = Number(credentials.id);
                if (isNaN(id)) return null;

                return {
                    id,
                    email: credentials.email,
                    nama_lengkap: credentials.nama_lengkap,
                    foto_profil: credentials.foto_profil,
                    token: credentials.token,
                };
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.nama_lengkap = user.nama_lengkap;
                token.name = user.nama_lengkap;
                token.foto_profil = user.foto_profil;
                token.token = user.token;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id as number;
                session.user.email = token.email as string;
                session.user.nama_lengkap = token.nama_lengkap as string;
                session.user.name = token.name as string;
                session.user.foto_profil = token.foto_profil as string;
                session.user.token = token.token as string;
            }
            return session;
        },
    },
};