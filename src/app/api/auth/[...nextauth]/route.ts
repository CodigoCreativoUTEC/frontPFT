import NextAuth, { DefaultSession, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { jwtDecode } from "jwt-decode";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      nombre: string;
      apellido: string;
      rol: string;
      needsAdditionalInfo?: boolean;
    } & DefaultSession["user"];
    jwt: string;
  }

  interface JWT {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
    jwt: string;
    needsAdditionalInfo?: boolean;
    exp?: number;
  }

  interface User {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
    jwt: string;
    needsAdditionalInfo?: boolean;
  }
}

interface JwtPayload {
  exp: number;
  email: string;
  perfil: string;
  [key: string]: any;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) throw new Error(data.error || "Authentication failed");
          if (!data.token || typeof data.token !== "string") {
            throw new Error("Invalid token format from server");
          }

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            nombre: data.user.nombre,
            apellido: data.user.apellido,
            rol: data.user.idPerfil?.nombrePerfil || "Usuario",
            jwt: data.token,
          } as User;
        } catch (error) {
          
          console.error("Credentials authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile: async (_, account): Promise<User> => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Google authentication failed");
          }

          const data = await response.json();

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            nombre: data.user.nombre || "",
            apellido: data.user.apellido || "",
            rol: data.user.idPerfil?.nombrePerfil || "Usuario",
            jwt: data.token,
            needsAdditionalInfo: data.userNeedsAdditionalInfo || false,
          } as User;
        } catch (error) {
          console.error("Google authentication error:", error);
          throw new Error("Google authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      const newToken = { ...token };

      if (user) {
        newToken.id = user.id;
        newToken.email = user.email;
        newToken.nombre = user.nombre;
        newToken.apellido = user.apellido;
        newToken.rol = user.rol;
        newToken.jwt = user.jwt;
        newToken.needsAdditionalInfo = user.needsAdditionalInfo;
      }

      if (newToken.jwt && typeof newToken.jwt === "string") {
        try {
          const decoded = jwtDecode<JwtPayload>(newToken.jwt);
          const now = Math.floor(Date.now() / 1000);
          const bufferTime = 300;

          if ((decoded.exp - now) < bufferTime) {
            const renewalResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/renovar-token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${newToken.jwt}`,
              },
            });

            if (renewalResponse.ok) {
              const { token: newTokenJwt } = await renewalResponse.json();
              if (typeof newTokenJwt === "string") {
                newToken.jwt = newTokenJwt;
                const newDecoded = jwtDecode<JwtPayload>(newTokenJwt);
                newToken.exp = newDecoded.exp;
              }
            }
          }
        } catch (error) {
          console.error("Token renewal error:", error);
        }
      }

      return newToken;
    },
    async session({ session, token }) {
        session.user = {
          ...session.user,
          id: typeof token.id === "string" ? token.id : "",
          email: typeof token.email === "string" ? token.email : "",
          nombre: typeof token.nombre === "string" ? token.nombre : "",
          apellido: typeof token.apellido === "string" ? token.apellido : "",
          rol: typeof token.rol === "string" ? token.rol : "",
          needsAdditionalInfo:
            typeof token.needsAdditionalInfo === "boolean"
              ? token.needsAdditionalInfo
              : false,
        };
      
        session.jwt = typeof token.jwt === "string" ? token.jwt : "";
        return session;
      }
      ,
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
});

export { handler as GET, handler as POST };
