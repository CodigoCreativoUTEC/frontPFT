"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EquipoModel, ReferrerEnum } from '@/types';
import EquiposList from '@/components/Equipos';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from '@/types/emuns';

const EquiposRead = () => {
  const [equipos, setEquipos] = useState<EquipoModel[]>([]);

  const fetcher = async () => {
    const res = await fetch("/api/equipos", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    setEquipos(result.filter((equipo: EquipoModel) => equipo.estado !== ReferrerEnum.INACTIVO));
  };

  useEffect(() => {
    fetcher().then(() => console.log("Obteniendo equipos"));
  }, []);

  const handleAddEquip = async (newEquip: EquipoModel) => {
    await fetch("/api/equipos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEquip),
    });

    fetcher(); // Actualiza la lista de equipos
  };

  if (!equipos.length) return <div>...loading</div>;
  return (
    <DefaultLayout>
      <div className='flex flex-col'>
        <div className=''>
          <Link href="/equipos/create" 
            className='bg-green-500 p-2 inline-block text-white'
          >
            Agregar
          </Link>
        </div>
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-center text-sm">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <td className="px-2 py-2">ID</td>
                      <td className='px-2 py-2'>Nombre</td>
                      <td className='px-2 py-2'>Tipo de Equipo</td>
                      <td className='px-2 py-2'>Marca</td>
                      <td className='px-2 py-2'>Modelo</td>
                      <td className='px-2 py-2'>Número de Serie</td>
                      <td className='px-2 py-2'>Garantía</td>
                      <td className='px-2 py-2'>País</td>
                      <td className='px-2 py-2'>Proveedor</td>
                      <td className='px-2 py-2'>Fecha de Adquirido</td>
                      <td className='px-2 py-2'>ID Interno</td>
                      <td className='px-2 py-2'>Ubicación</td>
                      <td className='px-2 py-2'>Imagen</td>
                      <td className='px-2 py-2'>Estado</td>
                      <td className='px-2 py-2'>Acciones</td>
                    </tr>
                  </thead>
                  <tbody className='bg-white items-center text-xs'>
                    {equipos.map((item: EquipoModel) => (
                      <EquiposList 
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

export default EquiposRead;
