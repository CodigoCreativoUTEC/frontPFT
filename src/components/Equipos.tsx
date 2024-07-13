import React from 'react';
import Link from 'next/link';
import { EquipoModel, ReferrerEnum } from '@/types';

interface EquiposListProps extends EquipoModel {
  fetcher: () => void;
}

const EquiposList: React.FC<EquiposListProps> = (params) => {
  return (
    <tr className="bg-gray-2 text-center dark:bg-meta-4 ">
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.id}</td>
      <td className=' px-2 py-2 font-medium text-black dark:text-white'>{params.nombre}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.tipo_equipo}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.marca}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.modelo}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.num_serie}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.garantia}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.pais}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.proveedor}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{new Date(params.fecha_adq).toLocaleDateString()}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.id_interno}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.ubicacion}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.imagen}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.estado}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>
        <span>
          <Link 
            href={`/equipos/delete/${params.id}`}
            className='bg-rose-500 p-2 inline-block ml-3 text-white text-xs rounded cursor-pointer'
          >
            Borrar
          </Link>
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

