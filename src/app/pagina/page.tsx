"use client"
import { useSession, signIn } from 'next-auth/react';


const ProtectedPage = () => {
  const { data: session, status } = useSession();
  console.log(session);


  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    signIn();
    return null;
  }
  const user = session.user.data;
  return (
    <div>
      <h1>Perfil del usuario</h1>
      <p>Nombre: {user.nombre}</p>
      <p>Apellido: {user.apellido}</p>
      <p>Email: {user.email}</p>
      <p>Nombre de usuario: {user.nombreUsuario}</p>
      {/* Renderiza otros campos del usuario */}
    </div>
  );
};

export default ProtectedPage;