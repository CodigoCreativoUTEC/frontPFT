# Arquitectura del Frontend

## 1. Stack Tecnológico

**Framework Principal:** Next.js 15.3.5 con React 19.0.0

**Gestor de Paquetes:** npm (evidenciado por package-lock.json)

**Librerías de UI:** 
- TailwindCSS 3.4.1 con plugins (prettier-plugin-tailwindcss)
- Flatpickr 4.6.13 (selector de fechas)
- ApexCharts 3.54.1 con React-ApexCharts (gráficos)
- JSVectorMap 1.6.0 (mapas vectoriales)

**Librerías Clave Adicionales:**
- **Autenticación:** NextAuth.js 4.24.11
- **Notificaciones:** React Hot Toast 2.5.2
- **Utilitarios:** JWT-decode 4.0.0, File-saver 2.0.5
- **Exportación:** jsPDF 3.0.1, jsPDF-autotable 5.0.2, XLSX 0.18.5
- **Criptografía:** Crypto-browserify 3.12.1
- **Desarrollo:** TypeScript 5, ESLint 9.17.0, Prettier 3.2.5

## 2. Estructura y Componentes

**Organización de Carpetas:** 
```
src/
├── app/               # App Router de Next.js 13+ (páginas y rutas)
│   ├── auth/          # Páginas de autenticación
│   ├── api/           # API routes
│   ├── equipos/       # Módulo de equipos
│   ├── usuarios/      # Módulo de usuarios
│   └── [otros módulos]
├── components/        # Componentes reutilizables
│   ├── common/        # Componentes comunes (AppShell, Loader)
│   ├── Helpers/       # Componentes utilitarios (Fetcher, DynamicTable)
│   ├── Layouts/       # Layouts de páginas (DefaultLayout)
│   ├── Paginas/       # Componentes específicos de página
│   └── [otros componentes]
├── hooks/            # Hooks personalizados
├── types/            # Definiciones de tipos TypeScript
├── css/              # Estilos globales
└── js/               # Archivos JavaScript adicionales
```

**Patrones de Componentes:**
- **Hooks personalizados:** useColorMode, useLocalStorage para funcionalidades reutilizables
- **Componentes funcionales:** Uso exclusivo de functional components con hooks
- **Componentes de orden superior:** SessionProvider de NextAuth envuelve toda la aplicación
- **Render Props:** Implementado en DynamicTable para renderizado flexible de celdas
- **Composición:** DefaultLayout compone Header, Sidebar y contenido principal

## 3. Gestión del Estado

**Librería Principal:** React Context API con hooks nativos de React y NextAuth Session

**Flujo de Datos:**
- **Estado Global:** Gestionado principalmente a través de NextAuth Session para autenticación
- **Estado Local:** Hooks useState para estado de componentes individuales
- **Persistencia:** useLocalStorage hook personalizado para datos que requieren persistencia (tema, preferencias)
- **Estado de Formularios:** Manejo directo con useState sin librerías externas como Formik

## 4. Comunicación con el Backend

**Cliente HTTP:** Fetch API nativa (no se usa Axios)

**Capa de Servicios:** Centralizada en `src/components/Helpers/Fetcher.tsx`

**Ejemplo de Llamada a la API:**
```typescript
// Ejemplo de fetcher con autenticación automática
const fetcher = async <T = any>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> => {
  const { method = "GET", body = null, requiresAuth = true, headers = {} } = options;
  
  const authToken = await getAuthToken(requiresAuth);
  const { headers: requestHeaders, body: requestBody } = prepareRequest(method, body, authToken, headers);
  
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;
  const response = await fetch(fullUrl, {
    method,
    headers: requestHeaders,
    body: requestBody,
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
    }
    await handleHttpError(response);
  }
  
  return response.json();
};

// Uso típico en componentes
const data = await fetcher<Usuario[]>("/usuarios", { requiresAuth: true });
```

## 5. Seguridad

**Manejo de Tokens JWT:**
- **Almacenamiento:** Los tokens se almacenan en la sesión de NextAuth (server-side)
- **Envío:** Se envían automáticamente en el header 'Authorization' como Bearer token a través del helper fetcher
- **Decodificación:** Se usa jwt-decode para extraer información del token

**Rutas Protegidas:**
- **Middleware:** Archivo middleware.ts vacío, sugiere que la protección se maneja a nivel de componente
- **Componente Guardian:** LoginForm implementa lógica de redirección basada en el estado de autenticación
- **Verificación en Fetcher:** Automáticamente verifica la existencia del token antes de hacer requests

**Flujo de Login/Logout:**
```typescript
// Login
const handleSubmit = async (e: React.FormEvent) => {
  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });
  
  if (result?.error) {
    // Manejo de errores
  } else {
    router.replace("/usuarios"); // Redirección después del login
  }
};

// Logout
const handleLogout = () => {
  signOut({ callbackUrl: "/auth/signin" });
};

// Verificación automática de sesión
React.useEffect(() => {
  if (status === "authenticated" && session?.jwt) {
    router.replace("/usuarios");
  } else if (status === "unauthenticated") {
    signOut({ callbackUrl: "/auth/signin" });
  }
}, [status, session, router]);
```

**Configuración de NextAuth:**
- **Providers:** Credentials y Google OAuth
- **JWT Strategy:** Personalizado con información del usuario (nombre, apellido, rol)
- **Session:** Extendida para incluir JWT token y información adicional del usuario
- **Callbacks:** jwt() y session() callbacks personalizados para manejar el token del backend

**Manejo de Errores de Autenticación:**
- **401 Unauthorized:** Redirección automática al login con mensaje visual
- **Expiración de Token:** Validación de expiración en el callback JWT
- **Reautenticación:** Signout forzado cuando la sesión está corrupta o vacía