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
                id: { type: "text" }, // atau "number", boleh dua-duanya
                email: { type: "text" },
                nama_lengkap: { type: "text" },
                foto_profil: { type: "text" },
                token: { type: "text" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const id = parseInt(credentials.id); // ✅ pastikan jadi number
                if (isNaN(id)) return null;

                return {
                    id, // ← sekarang ini number
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
                session.user.id = token.id as number; // tetap number
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