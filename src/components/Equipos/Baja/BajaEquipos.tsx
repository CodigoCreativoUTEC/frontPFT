import React from 'react';
import Link from 'next/link';
import { BajaEquipoModel, ReferrerEnum } from '@/types';

interface BajaEquiposListProps extends BajaEquipoModel {
  fetcher: () => void;
}

const BajaEquiposList: React.FC<BajaEquiposListProps> = (params) => {
  return (
    <tr className="bg-gray-2 text-center dark:bg-meta-4">
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.id}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.idEquipo.idTipo.nombreTipo}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{new Date(params.fecha).toLocaleDateString()}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.idUsuario.email}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.razon}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.comentarios}</td>
      <td className={`px-2 py-2 ${
                        params.estado === "INACTIVO"
                          ? "bg-rose-200 text-danger"
                          : "bg-amber-200 text-warning"
                    }`}>{params.estado}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>
        <span>  
        <Link 
          href={`/equipos/baja/${params.id}`}
          className='bg-blue-500 p-2 inline-block ml-3 text-white text-xs rounded cursor-pointer'
        >
          Ver
        </Link>
        </span>
      </td>
    </tr>
  );
}

export default BajaEquiposList;