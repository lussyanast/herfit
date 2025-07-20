import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24, // 1 hari
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials) return null;

                const loginRes = await fetch("https://herfit-ladiesgym.my.id/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                });

                const response = await loginRes.json();

                if (loginRes.ok && response.success) {
                    const user = response.data;
                    return {
                        id: user.id_pengguna,
                        email: user.email,
                        nama_lengkap: user.nama_lengkap,
                        foto_profil: user.foto_profil,
                        token: user.token,
                    };
                }

                return null; // trigger 401
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
    pages: {
        signIn: "/sign-in",
    },
    secret: process.env.NEXTAUTH_SECRET,
};