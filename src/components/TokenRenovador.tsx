import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

const SessionTimer = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.expires) {
      const expirationTime = new Date(session.expires).getTime();

      // Intervalo que se ejecuta cada 30 segundos para verificar la expiración del token
      const checkInterval = setInterval(() => {
        const currentTime = new Date().getTime();

        // Si el token está a punto de expirar (por ejemplo, faltan menos de 1 minuto)
        if (expirationTime - currentTime < 60 * 1000) {
          console.log("SessionManager: Token está a punto de expirar. Renovando sesión...");

          // Renovar la sesión sin redirigir al usuario
          signIn(undefined, { redirect: false })
            .then(() => {
              console.log("SessionManager: Sesión renovada exitosamente.");
            })
            .catch((error) => {
              console.error("SessionManager: Error al renovar la sesión:", error);
            });
        }
      }, 30 * 1000); // Verificar cada 30 segundos

      // Limpiar el intervalo cuando el componente se desmonte o cambie la sesión
      return () => clearInterval(checkInterval);
    }
  }, [session]);

  return null; // Este componente no necesita renderizar nada visible
};
export default SessionTimer;
