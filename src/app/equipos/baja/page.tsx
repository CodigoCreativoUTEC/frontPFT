"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BajaEquipoModel, ReferrerEnum } from '@/types';
import BajaEquiposList from '@/components/BajaEquipos';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from '@/types/emuns';

const EquiposBaja = () => {
  const [bajaEquipos, setBajaEquipos] = useState<BajaEquipoModel[]>([]);

  const fetcher = async () => {
    const res = await fetch("/api/equipos/baja", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    setBajaEquipos(result.filter((bajaEquipo: BajaEquipoModel) => bajaEquipo.estado));
  };

  useEffect(() => {
    fetcher().then(() => console.log("Obteniendo equipos de baja"));
  }, []);

  if (!bajaEquipos.length) return <div>...loading</div>;
  return (
    <DefaultLayout>
      <div className='flex flex-col'>
        
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-center text-sm">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <td className="px-2 py-2">ID</td>
                      <td className='px-2 py-2'>Nombre</td>
                      <td className='px-2 py-2'>Fecha de Baja</td>
                      <td className='px-2 py-2'>Usuario</td>
                      <td className='px-2 py-2'>Razón</td>
                      <td className='px-2 py-2'>Comentarios</td>
                      <td className='px-2 py-2'>Estado</td>
                      <td className='px-2 py-2'>Acciones</td>
                    </tr>
                  </thead>
                  <tbody className='bg-white items-center text-xs'>
                    {bajaEquipos.map((item: BajaEquipoModel) => (
                      <BajaEquiposList 
                        key={item.id}
                        {...item}
                        fetcher={fetcher} // Pasar la función fetcher para recargar los equipos
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default EquiposBaja;