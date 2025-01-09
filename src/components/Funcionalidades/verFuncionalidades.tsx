"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FuncionalidadModel } from '@/types';
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';

const FuncionalidadDetail = () => {
  const { data: session, status } = useSession();
  if (!session) { signIn(); }

  const router = useRouter();
  const { id } = useParams();
  const [funcionalidad, setFuncionalidad] = useState<FuncionalidadModel | null>(null);

  useEffect(() => {
    if (id) {
      const fetchFuncionalidad = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funcionalidades/buscar/?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session.accessToken || ''),
          },
        });
        if (res.ok) {
          const result = await res.json();
          setFuncionalidad(result);
        } else {
          console.error("Error al obtener la funcionalidad");
        }
      };
      fetchFuncionalidad();
    }
  }, [id, session]);

  if (!funcionalidad) return <div>Cargando...</div>;

  return (
    <div className="flex flex-wrap items-start">
      <div className="hidden w-full xl:block xl:w-1/4">
        <div className="px-6 py-7.5 text-center">
          <Link className="mb-5.5 inline-block" href="/">
            <Image
              className="hidden dark:block"
              src={"/images/logo/LogoCodigo.jpg"}
              alt="Logo"
              width={176}
              height={32}
            />
            <Image
              className="dark:hidden"
              src={"/images/logo/LogoCodigo.jpg"}
              alt="Logo"
              width={176}
              height={32}
            />
          </Link>
          <p className="2xl:px-20">
            Bienvenido al sistema de gestión de funcionalidades.
          </p>
        </div>
      </div>
      <div className="w-full items-center text-center xl:w-2/4 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="w-full p-4 sm:p-12.5 xl:p-7.5">
          <p><strong>ID:</strong> {funcionalidad.id}</p>
          <p><strong>Funcionalidad:</strong> {funcionalidad.nombreFuncionalidad}</p>
          <p><strong>Estado:</strong> {funcionalidad.estado}</p>
          <p><strong>Perfiles:</strong></p>
          <ul>
            {funcionalidad.perfiles && funcionalidad.perfiles.length > 0 ? (
              funcionalidad.perfiles.map((perfil) => (
                <li key={perfil.id}>{perfil.nombrePerfil}</li>
              ))
            ) : (
              <li>No hay perfiles asociados</li>
            )}
          </ul>
        </div>
        <button
          onClick={() => router.push('/funcionalidades')}
          className='mt-4 bg-blue-500 text-white p-2 rounded'
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default FuncionalidadDetail;
