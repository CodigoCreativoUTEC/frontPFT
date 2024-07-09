"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UsuarioModel, ReferrerEnum } from '@/types';
import UsuariosList from '@/components/Usuarios';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const UsuariosRead = () => {
  const [usuarios, setUsuarios] = useState<UsuarioModel[]>([]);

  const fetcher = async () => {
    const res = await fetch("/api/usuarios", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    setUsuarios(result.filter((usuario: UsuarioModel) => usuario.estado !== ReferrerEnum.INACTIVO));
  };

  useEffect(() => {
    fetcher().then(() => console.log("Obteniendo usuarios"));
  }, []);

  const handleAddUser = async (newUser: UsuarioModel) => {
    await fetch("/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    fetcher(); // Actualiza la lista de usuarios
  };

  if (!usuarios.length) return <div>...loading</div>;
  return (
    <DefaultLayout>
      <div className='flex flex-col'>
        <div className=''>
          <Link href="/usuarios/create" 
            className='bg-green-500 p-2 inline-block text-white'
          >
            Agregar
          </Link>
        </div>
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <td className="px-2 py-2">ID</td>
                      <td className='px-2 py-2'>Nombre</td>
                      <td className='px-2 py-2'>Apellido</td>
                      <td className='px-2 py-2'>Cédula</td>
                      <td className='px-2 py-2'>Fecha Nacimiento</td>
                      <td className='px-2 py-2'>Teléfonos</td>
                      <td className='px-2 py-2'>Email</td>
                      <td className='px-2 py-2'>Nombre de Usuario</td>
                      <td className='px-2 py-2'>Tipo de Usuario</td>
                      <td className='px-2 py-2'>Estado</td>
                      <td className='px-2 py-2'>Acciones</td>
                    </tr>
                  </thead>
                  <tbody className='bg-white items-center text-xs'>
                    {usuarios.map((item: UsuarioModel) => (
                      <UsuariosList 
                        key={item.id}
                        {...item}
                        fetcher={fetcher} // Pasar la función fetcher para recargar los usuarios
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

export default UsuariosRead;
