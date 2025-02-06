import { getSession } from "next-auth/react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type FetcherOptions = {
  method?: HttpMethod;
  body?: Record<string, any> | null;
  requiresAuth?: boolean;
  headers?: Record<string, string>;
};

const fetcher = async <T = any>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> => {
  const {
    method = "GET",
    body = null,
    requiresAuth = true,
    headers = {},
  } = options;

  try {
    // Verificar configuración esencial
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("API base URL is not configured");
    }

    let authToken: string | undefined;

    // Manejo de autenticación
    if (requiresAuth) {
      const session = await getSession();
      if (!session?.jwt) {
        throw new Error("No se encontró una sesión activa, ingrese nuevamente");
      }
      authToken = session.jwt;
    }

    // Configurar headers
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(requiresAuth && authToken && { Authorization: `Bearer ${authToken}` }),
      ...headers,
    };

    // Configurar el cuerpo de la petición
    let requestBody: string | undefined;
    if (body && ["POST", "PUT", "PATCH"].includes(method)) {
      requestBody = JSON.stringify(body);
    } else if (body) {
      console.warn(`Body is not recommended for ${method} requests`);
    }

    // Construir URL completa
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

    // Realizar la petición con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

    console.log(`Fetching [${method} ${fullUrl}]...`);

    const response = await fetch(fullUrl, {
      method,
      headers: defaultHeaders,
      body: requestBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Manejar respuesta no exitosa
    if (!response.ok) {
      // Leer el body como texto (solo se lee una vez)
      const text = await response.clone().text();
      let errorData: any;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text };
      }

      const httpError = new HttpError(
        response.status,
        errorData.message || errorData.error || `HTTP request failed: ${response.statusText}`
      );
      httpError.response = errorData;

      // Si el status es 401, mostramos el mensaje y redirigimos al login después de 3 segundos
      if (response.status === 401) {
        alert("No autorizado. Redirigiendo al login...");
        setTimeout(() => {
          window.location.href = "/auth/signin";
        }, 3000);
      }

      throw httpError;
    }

    // Manejar respuestas sin contenido
    if (response.status === 204) {
      return null as T;
    }

    return response.json() as Promise<T>;
  } catch (error: any) {
    console.error(`Fetcher Error [${method} ${url}]:`, error.message);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error; // Re-lanzar el error para manejo externo
  }
};

// Clase personalizada para errores HTTP
class HttpError extends Error {
  public response?: any;
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export default fetcher;
