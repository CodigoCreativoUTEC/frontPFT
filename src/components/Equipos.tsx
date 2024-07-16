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
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.idTipo.nombreTipo}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.idModelo.nombre}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.idModelo.idMarca.nombre}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.nroSerie}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.garantia}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.idPais.nombre}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.idProveedor.nombre}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{new Date(params.fechaAdquisicion).toLocaleDateString()}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.idInterno}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.idUbicacion.nombre}/{params.idUbicacion.sector}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'><img src={params.imagen} height={150} width={150}/></td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>{params.estado}</td>
      <td className='px-2 py-2 font-medium text-black dark:text-white'>
      <div className="inline-flex">
        <span>
          <Link 
            href={`/equipos/delete/${params.id}`}
            className='bg-rose-500 p-2 inline-block ml-1 text-white text-xs rounded cursor-pointer'
          >
            Borrar
          </Link>
        </span>
        <span>
          <Link 
            href={`/equipos/edit/${params.id}`}
            className='bg-yellow-500 p-2 inline-block ml-1 text-white text-xs rounded cursor-pointer'
          >
            Editar
          </Link>
        </span>
        <span>
        <Link 
          href={`/equipos/read/${params.id}`}
          className='bg-blue-500 p-2 inline-block ml-1 text-white text-xs rounded cursor-pointer'
        >
          Ver
        </Link>
        </span>
        </div>
      </td>
    </tr>
  );
}

export default EquiposList;

