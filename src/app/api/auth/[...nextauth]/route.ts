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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: profile?.email, name: profile?.name }),
        });
        const data = await res.json();
        if(res.ok && data.user.estado === "INACTIVO") { 
          //mostrar mensaje de cuenta inactiva
          error("Cuenta inactiva, por favor contacte al administrador");
          
          
          return false;
        }else if(res.ok && data.user.estado === "ACTIVO") {
          console.log("Datos recibidos de la API de Google login:", data);
          if (data.userNeedsAdditionalInfo) {
            return `/auth/signup?email=${profile?.email}`;
          }
          user.accessToken = data.token;
          user.data = data.user;
          return { ...user.data, accessToken: data.token };
        }else {
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        console.log("Datos del usuario en jwt callback:", user);
        //token.accessToken = user.accessToken;
        token.user = {
          ...user,
          id: user.id,
          cedula: user.cedula,
          contrasenia: user.contrasenia,
          fechaNacimiento: user.fechaNacimiento,
          estado: user.estado,
          nombre: user.nombre,
          apellido: user.apellido,
          nombreUsuario: user.nombreUsuario,
          idInstitucion: user.idInstitucion,
          idPerfil: user.idPerfil,
          usuariosTelefonos: user.usuariosTelefonos
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Datos del token en session callback:", token);
      //session.accessToken = token.accessToken as string;
      session.user = {
        ...token.user,
        id: token.user.id,
        cedula: token.user.cedula,
        contrasenia: token.user.contrasenia,
        fechaNacimiento: token.user.fechaNacimiento,
        estado: token.user.estado,
        nombre: token.user.nombre,
        apellido: token.user.apellido,
        nombreUsuario: token.user.nombreUsuario,
        idInstitucion: token.user.idInstitucion,
        idPerfil: token.user.idPerfil,
        usuariosTelefonos: token.user.usuariosTelefonos,
      };
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
