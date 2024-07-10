import React from 'react';
import Link from 'next/link';
import { BajaEquipoModel, ReferrerEnum } from '@/types';

interface BajaEquiposListProps extends BajaEquipoModel {
  fetcher: () => void;
}

const BajaEquiposList: React.FC<BajaEquiposListProps> = (params) => {
  return (
    <tr className="border-b dark:border-neutral-500 ">
      <td className='px-2 py-2'>{params.id}</td>
      <td className=' px-2 py-2'>{params.nombre}</td>
      <td className='px-2 py-2'>{new Date(params.fecha_baja).toLocaleDateString()}</td>
      <td className='px-2 py-2'>{params.usuario}</td>
      <td className='px-2 py-2'>{params.razon}</td>
      <td className='px-2 py-2'>{params.comentarios}</td>
      <td className='px-2 py-2'>{params.estado}</td>
      <td className='px-2 py-2'>
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