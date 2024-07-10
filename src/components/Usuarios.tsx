import React from 'react';
import Link from 'next/link';
import { UsuarioModel, ReferrerEnum } from '@/types';

interface UsuariosListProps extends UsuarioModel {
  fetcher: () => void;
}

const UsuariosList: React.FC<UsuariosListProps> = (params) => {
  const borrarUsuario = async (id: number) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: ReferrerEnum.INACTIVO }), // Actualiza el estado a Inactivo
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el usuario');
      }

      // Recargar la lista de usuarios
      params.fetcher();
    } catch (error) {
      console.error('Error al borrar usuario:', error);
    }
  };

  return (
    <tr className="border-b dark:border-neutral-500 ">
      <td className='px-2 py-2'>{params.id}</td>
      <td className=' px-2 py-2'>{params.nombre}</td>
      <td className='px-2 py-2'>{params.apellido}</td>
      <td className='px-2 py-2'>{params.cedula}</td>
      <td className='px-2 py-2'>{new Date(params.fecha_nasc).toLocaleDateString()}</td>
      <td className='px-2 py-2'>
        {params.telefono ? (Array.isArray(params.telefono) ? params.telefono.join(', ') : Object.values(params.telefono).join(', ')) : ''}
      </td>
      <td className='px-2 py-2'>{params.email}</td>
      <td className='px-2 py-2'>{params.nombre_usuario}</td>
      <td className='px-2 py-2'>{params.tipo_usuario}</td>
      <td className='px-2 py-2'>{params.estado}</td>
      <td className='px-2 py-2'>
        <span 
          className='bg-rose-500 p-2 inline-block ml-3 text-white text-xs rounded cursor-pointer'
          onClick={() => borrarUsuario(params.id)}
        >
          Borrar
        </span>
        <span>
        <Link 
          href={`/usuarios/edit/${params.id}`}
          className='bg-yellow-500 p-2 inline-block ml-3 text-white text-xs rounded cursor-pointer'
        >
          Editar
        </Link>
        </span>
        <Link 
          href={`/usuarios/read/${params.id}`}
          className='bg-blue-500 p-2 inline-block ml-3 text-white text-xs rounded cursor-pointer'
        >
          Ver
        </Link>
      </td>
    </tr>
  );
}

export default UsuariosList;
