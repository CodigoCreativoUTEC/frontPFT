"use client"; 

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProveedorModel, ReferrerEnum } from '@/types';
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';

const ProveedorDetail = () => {
  const { data: session, status } = useSession();
  if (!session) { signIn(); }

  const router = useRouter();
  const { id } = useParams();
  const [proveedor, setProveedor] = useState<ProveedorModel | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProveedor = async () => {
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/proveedores/buscarPorId?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session.accessToken || ''),
          },
        });
        if (res.ok) {
          const result = await res.json();
          setProveedor(result);
        } else {
          console.error("Error al obtener el proveedor");
        }
      };
      fetchProveedor();
    }
  }, [id, session]);

  if (!proveedor) return <div>Cargando...</div>;

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
              Bienvenido al sistema de gestión de mantenimiento.
            </p>
          </div>
        </div>
        <div className='w-full items-center text-center xl:w-2/4 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
          <div className='w-full p-4 sm:p-12.5 xl:p-7.5'>
            <p><strong>ID:</strong> {proveedor.id}</p>
            <p><strong>Nombre del Proveedor:</strong> {proveedor.nombre}</p>
            <p><strong>Estado:</strong> {proveedor.estado}</p>
          </div>
          <button
              onClick={() => router.push('/proveedores')}
              className='mt-4 bg-blue-500 text-white p-2 rounded'
          >
            Volver
          </button>
        </div>
      </div>
  );
}

export default ProveedorDetail;