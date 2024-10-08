// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  // Extraer el token JWT de la cookie
  const token = await getToken({ req, secret: process.env.SECRET });
  
  // Si el usuario tiene un token, continuar con la solicitud
  if (token) {
    return NextResponse.next();
  }

  // Si no hay token, redirigir a la página de login
  const loginUrl = new URL("/auth/signin", req.url);
  return NextResponse.redirect(loginUrl);
}

// Opcionalmente, puedes especificar en qué rutas aplicar el middleware
export const config = {
  matcher: ["/escritorio/:path*",
    "/equipos/:path*",
    "/funcionalidades/:path*", 
    "/intervenciones/:path*", 
    "/marcas/:path*", 
    "/modelos/:path*", 
    "/perfiles/:path*",
    "/proveedores/:path*",
    "/tipo_equipo/:path*",
    "/usuarios/:path*"
], // Aplica solo en rutas específicas
};
