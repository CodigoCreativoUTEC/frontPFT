import React from 'react';
import Link from 'next/link';
import { UsuarioModel, ReferrerEnum } from '@/types';

interface UsuariosListProps extends UsuarioModel {
  usuariosTelefonos: any;
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
    <tr className="border-b text-black bold dark:border-neutral-500 odd:bg-blue-200 ">
      <td className='px-2 py-2'>{params.id}</td>
      <td className='px-2 py-2'>{params.nombre}</td>
      <td className='px-2 py-2'>{params.apellido}</td>
      <td className='px-2 py-2'>{params.cedula}</td>
      <td className='px-2 py-2'>{new Date(params.fechaNacimiento).toLocaleDateString()}</td>
      <td className="px-2 py-2">
    {params.usuariosTelefonos ? (
      params.usuariosTelefonos.map((telefono) => telefono.numero).join(', ')
    ) : ''}
  </td>
      <td className='px-2 py-2'>{params.email}</td>
      <td className='px-2 py-2'>{params.nombreUsuario}</td>
      <td className="px-2 py-2">{params.idPerfil?.nombrePerfil}</td>
      <td className='px-2 py-2'><p className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                      params.estado === "ACTIVO"
                        ? "bg-success text-success"
                        : params.estado === "INACTIVO"
                          ? "bg-danger text-danger"
                          : "bg-warning text-warning"
                    }`}
                  >{params.estado}</p></td>
      <td className='px-2 py-2'>
        <span 
          className='bg-rose-500 p-2 inline-block ml-3 text-whiter text-xs rounded cursor-pointer'
          onClick={() => borrarUsuario(params.id)}
        >
          Borrar
        </span>
        <span>
        <Link 
          href={`/usuarios/edit/${params.id}`}
          className='bg-yellow-500 p-2 inline-block ml-3 text-black text-xs rounded cursor-pointer'
        >
          Editar
        </Link>
        </span>
        <Link 
          href={`/usuarios/read/${params.id}`}
          className='bg-blue-500 p-2 inline-block ml-3 text-black text-xs rounded cursor-pointer'
        >
          Ver
        </Link>
      </td>
    </tr>
  );
}

export default UsuariosList;
