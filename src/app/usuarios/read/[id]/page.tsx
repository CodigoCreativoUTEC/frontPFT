"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UsuarioModel } from '@/types';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const UsuarioDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [usuario, setUsuario] = useState<UsuarioModel | null>(null);

  useEffect(() => {
    if (id) {
      const fetchUsuario = async () => {
        const res = await fetch(`/api/usuarios/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const result = await res.json();
          setUsuario(result);
        } else {
          console.error("Error al obtener el usuario");
        }
      };
      fetchUsuario();
    }
  }, [id]);

  if (!usuario) return <div>...loading</div>;

  return (
    <DefaultLayout>
      <div className='container mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Detalles del Usuario</h1>
        <div className='bg-white p-4 rounded shadow-md'>
          <p><strong>ID:</strong> {usuario.id}</p>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Apellido:</strong> {usuario.apellido}</p>
          <p><strong>Cédula:</strong> {usuario.cedula}</p>
          <p><strong>Fecha de Nacimiento:</strong> {new Date(usuario.fecha_nasc).toLocaleDateString()}</p>
          <p><strong>Teléfonos:</strong> {usuario.telefono ? (Array.isArray(usuario.telefono) ? usuario.telefono.join(', ') : Object.values(usuario.telefono).join(', ')) : ''}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Nombre de Usuario:</strong> {usuario.nombre_usuario}</p>
          <p><strong>Tipo de Usuario:</strong> {usuario.tipo_usuario}</p>
          <p><strong>Estado:</strong> {usuario.estado}</p>
        </div>
        <button
          onClick={() => router.push('/usuarios')}
          className='mt-4 bg-blue-500 text-white p-2 rounded'
        >
          Volver
        </button>
      </div>
    </DefaultLayout>
  );
}

export default UsuarioDetail;
