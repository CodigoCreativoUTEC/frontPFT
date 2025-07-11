import { getSession, signOut } from "next-auth/react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type FetcherOptions = {
  method?: HttpMethod;
  body?: Record<string, any> | null;
  requiresAuth?: boolean;
  headers?: Record<string, string>;
};

// Helper function to get auth token
const getAuthToken = async (requiresAuth: boolean): Promise<string | undefined> => {
  if (!requiresAuth) return undefined;
  
  const session = await getSession();
  if (!session?.jwt) {
    throw new Error("No se encontró una sesión activa, ingrese nuevamente");
  }
  return session.jwt;
};

// Helper function to prepare request
const prepareRequest = (method: HttpMethod, body: Record<string, any> | null, authToken: string | undefined, headers: Record<string, string>) => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...headers,
  };

  let requestBody: string | undefined;
  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    requestBody = JSON.stringify(body);
  } else if (body) {
    console.warn(`Body is not recommended for ${method} requests`);
  }

  return { headers: defaultHeaders, body: requestBody };
};

// Helper function to handle 401 errors
const handleUnauthorized = () => {
  console.error("\x1b[31m%s\x1b[0m", "No autorizado. Redirigiendo al login...");
  
  const existing = document.getElementById('auth-message');
  if (!existing) {
    const div = document.createElement('div');
    div.id = 'auth-message';
    div.innerText = 'No autorizado. Serás redirigido al login...';
    div.style.position = 'fixed';
    div.style.top = '20px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.background = '#f87171';
    div.style.color = 'white';
    div.style.padding = '12px 24px';
    div.style.borderRadius = '8px';
    div.style.zIndex = '9999';
    document.body.appendChild(div);
  }
  
  setTimeout(() => {
    signOut({ callbackUrl: "/auth/signin" });
  }, 2000);
};

// Helper function to handle HTTP errors
const handleHttpError = async (response: Response): Promise<never> => {
  const text = await response.clone().text();
  let errorData: any;
  try {
    errorData = JSON.parse(text);
  } catch {
    errorData = { message: text || response.statusText };
  }

  let errorMessage: string;
  if (response.status === 404) {
    errorMessage = "El recurso solicitado no fue encontrado";
  } else {
    errorMessage = errorData.message || errorData.error || `HTTP request failed: ${response.statusText}`;
  }

  const httpError = new HttpError(
    response.status,
    errorMessage
  );
  httpError.response = errorData;

  if (response.status === 401) {
    handleUnauthorized();
  }

  console.error(`HTTP Error ${response.status}: ${errorMessage}`);
  throw httpError;
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
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("API base URL is not configured");
    }

    const authToken = await getAuthToken(requiresAuth);
    const { headers: requestHeaders, body: requestBody } = prepareRequest(method, body, authToken, headers);
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    console.log(`Fetching [${method} ${fullUrl}]...`);

    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleHttpError(response);
    }

    if (response.status === 204) {
      return null as T;
    }

    // Verificar si la respuesta tiene contenido antes de parsear JSON
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Si no hay content-type de JSON o content-length es 0, retornar null
    if ((!contentType || !contentType.includes('application/json')) || contentLength === '0') {
      return null as T;
    }

    // Verificar si hay contenido en el cuerpo
    const text = await response.clone().text();
    if (!text || text.trim() === '') {
      return null as T;
    }

    return response.json() as Promise<T>;
  } catch (error: any) {
    console.error(`Fetcher Error [${method} ${url}]:`, error.message);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
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
