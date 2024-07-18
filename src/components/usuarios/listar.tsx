"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UsuarioModel, ReferrerEnum } from '@/types';
import UsuariosList from '@/components/Usuarios';
import { signIn, useSession } from 'next-auth/react';


const UsuariosRead = () => {
  const { data: session, status } = useSession();
  const [usuarios, setUsuarios] = useState<UsuarioModel[]>([]);

  const fetcher = async () => {
    const res = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/ListarTodosLosUsuarios", {
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + (session?.user?.accessToken || ''),
      },
    });
    const result = await res.json();
    setUsuarios(result.filter((usuario: UsuarioModel) => usuario.estado !== ReferrerEnum.INACTIVO));
  };

  useEffect(() => {
    fetcher().then(() => console.log("Obteniendo usuarios"));
  }, []);

  
  if (!session) {signIn();return null;}
  return (
      <div className='rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
        <div className=''>
          <Link href="/usuarios/create" 
            className='bg-green-500 p-2 inline-block text-white mb-4'
          >
            Agregar
          </Link>
        </div>
        <h4 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Lista de Usuarios
      </h4>
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr className='bg-gray-2 text-center dark:bg-meta-4'>
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
                      <td className='px-4 py-4 font-medium text-black dark:text-white'>Acciones</td>
                    </tr>
                  </thead>
                  <tbody className='bg-white items-center text-xs'>
                    {usuarios.map((item: UsuarioModel) => (
                      <UsuariosList 
                        usuariosTelefonos={undefined} key={item.id}
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
  );
}

export default UsuariosRead;
