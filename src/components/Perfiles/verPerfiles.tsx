"use client";

/*
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {PerfilModel, ReferrerEnum} from '@/types';
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';

const PerfilDetail = () => {
  const { data: session, status } = useSession();
  if (!session) { signIn(); }

  const router = useRouter();
  const { id } = useParams();
  const [perfil, setPerfil] = useState<PerfilModel | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPerfil = async () => {
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/perfiles/BuscarPerfilPorId?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.user?.accessToken || ''),
          },
        });
        if (res.ok) {
          const result = await res.json();
          setPerfil(result);
        } else {
          console.error("Error al obtener el perfil");
        }
      };
      fetchPerfil();
    }
  }, [id, session]);

  if (!perfil) return <div>Cargando...</div>;

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
                  height{32}
              />
            </Link>
            <p className="2xl:px-20">
              Bienvenido al ingreso al sistema de gestión de mantenimiento de equipos clínicos hospitalarios.
            </p>
          </div>
        </div>
        <div className='w-full items-center text-center xl:w-2/4 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
          <div className='w-full p-4 sm:p-12.5 xl:p-7.5'>
            <p><strong>ID:</strong> {perfil.id}</p>
            <p><strong>Nombre del Perfil:</strong> {perfil.nombre}</p>
            <p><strong>Estado:</strong> {perfil.estado}</p>
          </div>
          <button
              onClick={() => router.push('/perfiles')}
              className='mt-4 bg-blue-500 text-white p-2 rounded'
          >
            Volver
          </button>
        </div>
      </div>
  );
}

export default PerfilDetail;
*/

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { PerfilModel, ReferrerEnum } from '@/types';

const initialPerfiles = [
    { id: 1, nombre: "Perfil A", estado: ReferrerEnum.ACTIVO },
    { id: 2, nombre: "Perfil B", estado: ReferrerEnum.INACTIVO },
    { id: 3, nombre: "Perfil C", estado: ReferrerEnum.ACTIVO }
];

const PerfilDetail = () => {
    const router = useRouter();
    const { id } = useParams();
    const [perfil, setPerfil] = useState<PerfilModel | null>(null);

    useEffect(() => {
        const foundPerfil = initialPerfiles.find(p => p.id === Number(id));
        // @ts-ignore
        setPerfil(foundPerfil || null);
    }, [id]);

    if (!perfil) return <div>Cargando...</div>;

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
                    <p><strong>ID:</strong> {perfil.id}</p>
                    <p><strong>Nombre del Perfil:</strong> {perfil.nombre}</p>
                    <p><strong>Estado:</strong> {perfil.estado}</p>
                </div>
                <button
                    onClick={() => router.push('/perfiles')}
                    className='mt-4 bg-blue-500 text-white p-2 rounded'
                >
                    Volver
                </button>
            </div>
        </div>
    );
}

export default PerfilDetail;
