import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usuario: { label: "Usuario", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize: Intentando iniciar sesión con credenciales");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.usuario,
            password: credentials?.password
          })
        });

        const data = await res.json();
        if (res.ok && data && data.user.estado === "ACTIVO") {
          console.log("Authorize: Usuario activo encontrado, creando token");

          const transformedData = {
            id: data.user.id,
            name: `${data.user.nombre} ${data.user.apellido}`,
            email: data.user.email,
            perfil: data.user.idPerfil.nombrePerfil,
            accessToken: data.token,
            exp: Math.floor(Date.now() / 1000) + (5 * 60) // Expira en 5 minutos desde ahora
          };
          return transformedData;
        } else if (res.status === 401) {
          console.log("Authorize: Credenciales incorrectas");
          throw new CustomError(data.error);
        } else if (data.user.estado === "INACTIVO") {
          console.log("Authorize: Cuenta inactiva");
          throw new CustomError("Cuenta inactiva, por favor contacte al administrador");
        } else {
          console.log("Authorize: Error desconocido");
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        console.log("SignIn: Usuario inició sesión con Google, obteniendo token personalizado");

        try {
          const idToken = account.id_token; // Token de Google

          // Realizar solicitud para obtener un token JWT personalizado para tu backend
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }) // Enviamos el idToken de Google
          });

          const data = await res.json();

          if (res.ok) {
            user.accessToken = data.token; // Guardar el JWT en el usuario
            user.id = data.user.id;
            user.perfil = data.user.idPerfil.nombrePerfil;
            console.log("SignIn: Token personalizado obtenido correctamente");
            return true;
          } else {
            console.warn("SignIn: Error al obtener el token personalizado:", data.error);
            return false;
          }
        } catch (error) {
          console.error("SignIn: Error durante la obtención del token personalizado:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      console.log("JWT: Callback ejecutado");
    
      const TOKEN_RENEWAL_MARGIN = 60; // Renovar si falta menos de 1 minuto (en segundos)
      const currentTime = Math.floor(Date.now() / 1000);
    
      // Si es la primera vez que se crea el token, agregar la información del usuario
      if (user) {
        console.log("JWT: Creando nuevo token para el usuario");
        token.accessToken = user.accessToken;
        token.email = user.email;
        token.perfil = user.perfil;
        token.name = user.name;
        token.id = user.id;
        token.exp = Math.floor(Date.now() / 1000) + (5 * 60);
      }
    
      // Verificar si el token está a punto de expirar
      if (token.exp && token.exp - currentTime < TOKEN_RENEWAL_MARGIN) {
        console.log("JWT: Token a punto de expirar, intentando renovarlo");
    
        try {
          // Realizar la solicitud para renovar el token
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/renovar-token`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token.accessToken}`,
              'Content-Type': 'application/json'
            }
          });
    
          if (res.ok) {
            const data = await res.json();
            token.accessToken = data.token; // Actualizar el accessToken
            token.exp = Math.floor(Date.now() / 1000) + (5 * 60); // Actualizar la expiración a 5 minutos desde ahora
            console.log("JWT: Token renovado exitosamente");
          } else {
            console.warn("JWT: Error al renovar el token:", await res.json());
          }
        } catch (error) {
          console.error("JWT: Error durante la renovación del token:", error);
        }
      }
    
      return token;
    },
    

    async session({ session, token }) {
      console.log("Session: Callback ejecutado");

      // Inicializar session.user si no está presente
      if (!session.user) {
        console.log("Session: Inicializando usuario en la sesión");
        session.user = {
          perfil: "",
          id: 0,
          name: null,
          email: null,
          image: null,
          accessToken: ""
        };
      }

      // Asignar valores al objeto session.user
      session.user.email = token.email ?? null;
      session.user.perfil = token.perfil ?? "Usuario";
      session.user.id = token.id ?? 0;
      session.user.name = token.name ?? null;
      session.expires = token.exp ? new Date(token.exp * 1000).toISOString() : "";
      session.accessToken = token.accessToken;

      console.log("Session: Sesión actualizada con el nuevo token");

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 5 * 60, // Máximo de 5 minutos de sesión antes de necesitar renovarse
    updateAge: 2 * 60, // Actualizar cada 2 minutos para mantener la sesión viva
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET,
  }
});

export { handler as GET, handler as POST };
