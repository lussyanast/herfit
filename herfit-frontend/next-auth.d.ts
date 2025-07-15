import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            email: string;
            nama_lengkap: string;
            foto_profil: string;
            token: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: number;
        email: string;
        nama_lengkap: string;
        foto_profil: string;
        token: string;
    }
}
