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
        if (res.ok && data && data.user.estado === "ACTIVO") {
          // Transformar los datos según el formato deseado
          const transformedData = {
            id: data.user.id,
            name: data.user.nombre + " " + data.user.apellido,
            email: data.user.email,
            perfil: data.user.idPerfil.nombrePerfil,  // Asegúrate de que perfil está en user
            accessToken: data.token
          };
          return transformedData as any;
        } else if (res.status === 401) {
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
        console.log("ID Token:", account.id_token);
        const idToken = account.id_token; // Obtenemos el idToken desde el account
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }), // Enviamos el idToken
        });
        const data = await res.json();
        
        if (data.userNeedsAdditionalInfo) {
          return `/auth/signup?email=${profile?.email}`;
        }
        if (data.error === "Cuenta inactiva, por favor contacte al administrador") {
          throw new CustomError(data.error || "Cuenta inactiva, por favor contacte al administrador");
        } else {
          user.accessToken = data.token;
          user.id = data.user.id;
          user.nombre = data.user.nombre;
          user.perfil = data.user.idPerfil.nombrePerfil;
          return { ...user.nombre, accessToken: data.token, perfil: user.perfil };
        }
      } else {
        return true;
      }
    },

    // Aquí se incluye el email y perfil en el token JWT
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.email = user.email;  // Incluir el email en el token
        token.perfil = user.perfil;  // Incluir el perfil en el token
        token.name = user.name;
        token.id = user.id;
      }
      return token;
    },

    // Aquí se envía el perfil junto con la sesión
    async session({ session, token }) {
      // Asegúrate de que session.user esté definido
      if (!session.user) {
        session.user = {}; // Inicializar un objeto vacío si no está definido
      }
  
      // Asignar los valores de email y perfil a session.user
      session.user.email = token.email || null; // Si token.email no está presente, asigna null
      session.user.perfil = token.perfil || null; // Asigna el perfil al objeto session
      session.user.id = token.id;
      session.user.name = token.name;
      session.accessToken = token.accessToken as string;
  
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días de expiración
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET
  }
});

export { handler as GET, handler as POST };
