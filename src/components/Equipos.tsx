import React from 'react';
import Link from 'next/link';
import { EquipoModel, ReferrerEnum } from '@/types';

interface EquiposListProps extends EquipoModel {
  fetcher: () => void;
}

const EquiposList: React.FC<EquiposListProps> = (params) => {
  const borrarEquipo = async (id: number) => {
    try {
      const response = await fetch(`/api/equipos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: ReferrerEnum.INACTIVO }), // Actualiza el estado a Inactivo
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el equipo');
      }

      // Recargar la lista de equipos
      params.fetcher();
    } catch (error) {
      console.error('Error al borrar equipo:', error);
    }
  };

  return (
    <tr className="border-b dark:border-neutral-500 ">
      <td className='px-2 py-2'>{params.id}</td>
      <td className=' px-2 py-2'>{params.nombre}</td>
      <td className='px-2 py-2'>{params.tipo_equipo}</td>
      <td className='px-2 py-2'>{params.marca}</td>
      <td className='px-2 py-2'>{params.modelo}</td>
      <td className='px-2 py-2'>{params.num_serie}</td>
      <td className='px-2 py-2'>{params.garantia}</td>
      <td className='px-2 py-2'>{params.pais}</td>
      <td className='px-2 py-2'>{params.proveedor}</td>
      <td className='px-2 py-2'>{new Date(params.fecha_adq).toLocaleDateString()}</td>
      <td className='px-2 py-2'>{params.id_interno}</td>
      <td className='px-2 py-2'>{params.ubicacion}</td>
      <td className='px-2 py-2'>{params.imagen}</td>
      <td className='px-2 py-2'>{params.estado}</td>
      <td className='px-2 py-2'>
        <span 
          className='bg-rose-500 p-2 inline-block ml-3 text-white text-xs rounded cursor-pointer'
          onClick={() => borrarEquipo(params.id)}
        >
          Borrar
        </span>
        <span>
        <Link 
          href={`/equipos/edit/${params.id}`}
          className='bg-yellow-500 p-2 inline-block ml-3 text-white text-xs rounded cursor-pointer'
        >
          Editar
        </Link>
        </span>
        <Link 
          href={`/equipos/read/${params.id}`}
          className='bg-blue-500 p-2 inline-block ml-3 text-white text-xs rounded cursor-pointer'
        >
          Ver
        </Link>
      </td>
    </tr>
  );
}

export default EquiposList;
