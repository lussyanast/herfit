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
                id: { type: "text" },
                email: { type: "text" },
                nama_lengkap: { type: "text" },
                foto_profil: { type: "text" },
                token: { type: "text" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                // pastikan id dikonversi jadi string (NextAuth butuh string)
                return {
                    id: String(credentials.id),
                    email: credentials.email,
                    nama_lengkap: credentials.nama_lengkap,
                    foto_profil: credentials.foto_profil,
                    token: credentials.token,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.nama_lengkap = user.nama_lengkap;
                token.foto_profil = user.foto_profil;
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.nama_lengkap = token.nama_lengkap as string;
                session.user.name = token.nama_lengkap as string;
                session.user.foto_profil = token.foto_profil as string;
                session.user.token = token.token as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
};
