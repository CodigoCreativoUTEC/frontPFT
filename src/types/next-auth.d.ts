import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        jwt: string; // Define el token JWT
    }
}
