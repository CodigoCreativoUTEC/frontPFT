import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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

interface Session {
  accessToken: string;
  user: User;
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
      async authorize(credentials, req) {
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });

        const user = await res.json();
        if (res.ok && user) {
          return { ...user.user, accessToken: user.token };
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: profile.email, name: profile.name }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Datos recibidos de la API de Google login:", data);

          user.accessToken = data.token;
          user.data = data.user;

          if (data.userNeedsAdditionalInfo) {
            return `/auth/signup?email=${profile.email}&name=${profile.name}`;
          }

          return { ...data.user, accessToken: data.token };
        } else {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("Datos del usuario en jwt callback:", user);
        token.accessToken = user.accessToken;
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
      session.accessToken = token.accessToken as string;
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
        image: `https://ui-avatars.com/api/?name=${token.user.nombre}+${token.user.email}`
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
