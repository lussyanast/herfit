import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    }),
                });

                const data = await res.json();

                if (res.ok && data.success && data.data) {
                    return {
                        id: data.data.id_pengguna,
                        email: data.data.email,
                        name: data.data.nama_lengkap,
                        nama_lengkap: data.data.nama_lengkap,
                        foto_profil: data.data.foto_profil,
                        token: data.data.token,
                    };
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.nama_lengkap;
                token.nama_lengkap = user.nama_lengkap;
                token.foto_profil = user.foto_profil;
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as number;
                session.user.email = token.email as string;
                session.user.name = token.nama_lengkap as string;
                session.user.nama_lengkap = token.nama_lengkap as string;
                session.user.foto_profil = token.foto_profil as string;
                session.user.token = token.token as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};