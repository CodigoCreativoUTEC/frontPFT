import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import Error from "next/error";
import { error } from "console";

interface User {
  token: string;
  accessToken: string;
  id: number;
  cedula: string;
  email: string;
  contrasenia: string;
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
      async authorize(credentials) {
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });


        const data = await res.json();
        console.log(data);

if (res.ok && data && data.user.estado === "ACTIVO") {
  // Transformar los datos según el formato deseado
  const transformedData = {
    
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      image: data.user.image,
      data: {
        ...data.user,
      },
    
    expires: data.expires,
    accessToken: data.token
  };

  return transformedData;
} else if (res.ok && data && data.user.estado === "INACTIVO") { 
  //mostrar mensaje de cuenta inactiva
  console.log("Cuenta inactiva, por favor contacte al administrador");
  return alert("Cuenta inactiva, por favor contacte al administrador");
}else {
  return null;
}

      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
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
        if(res.ok && data.user.estado === "INACTIVO") {
          error("Cuenta inactiva, por favor contacte al administrador");
          console.log("Cuenta inactiva, por favor contacte al administrador");
          return false;
        }
        user.accessToken = data.token;
        user.data = data.user;
        return { ...user.data, accessToken: data.token };
      } else {
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET
  }
});

export { handler as GET, handler as POST };
