import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";


class CustomError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

interface User {
  token: string;
  accessToken: string;
  id: number;
  cedula: string;
  email: string;
  // contrasenia: string; // Removido para evitar enviar contraseñas
  fechaNacimiento: [number, number, number];
  estado: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  idInstitucion: {
    id: number;
    nombre: string;
  };
  idPerfil: {
    permisos: Array<{
      id: number;
      tipoPermiso: string;
    }>;
    id: number;
    nombrePerfil: string;
    estado: string;
  };
  usuariosTelefonos: Array<{
    id: number;
    numero: string;
  }>;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usuario: { label: "Usuario", type: "text" },
        password: { label: "Password", type: "password" }
      },

      
      async authorize(credentials, req): Promise<User | null> {
        const hashedPassword = credentials ? crypto.createHash('sha256').update(credentials.password).digest('hex') : '';
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario: credentials?.usuario,
            password: hashedPassword
          })
        });

        const data = await res.json();
        console.log('Response data:', data);
        console.log('Response status:', res.status);
        if (res.ok && data && data.user.estado === "ACTIVO") {
          console.log("pase por aqui", data);
          // Transformar los datos según el formato deseado
          const transformedData = {
            id: data.user.id,
            name: data.user.nombre,
            email: data.user.email,
            // No hay campo image en data.user, por lo que se elimina
            data: {
              ...data.user,
            },
            expires: data.expires,
            accessToken: data.token
          };
          return transformedData;
        } else if ( res.status === 401) {
          throw new CustomError(data.error);
        } else if (data.user.estado === "INACTIVO") {
          throw new CustomError("Cuenta inactiva, por favor contacte al administrador");
        } else {
          throw new CustomError("Error desconocido, por favor intente nuevamente");
        }
        
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }): Promise<any> {
      if (account?.provider === "google") {
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: profile?.email, name: profile?.name }),
        });
        const data = await res.json();
        console.log(data);
        if (data.userNeedsAdditionalInfo) {
          return `/auth/signup?email=${profile?.email}`;
        }
        if (data.error === "Cuenta inactiva, por favor contacte al administrador") {
          //throw new CustomError("Cuenta inactiva, por favor contacte al administrador");
          throw new CustomError(data.error || "Cuenta inactiva, por favor contacte al administrador");
        } else {
          user.accessToken = data.token;
          user.data = data.user;
          console.log( "esto va a la sesion",{...user.data, accessToken: data.token});
          return { ...user.data, accessToken: data.token };
        }
      } else {
        return true;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;

        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user = token.user;
      console.log("session", session);
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,// 30 dias de expiracion
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET
  }
});

export { handler as GET, handler as POST };
