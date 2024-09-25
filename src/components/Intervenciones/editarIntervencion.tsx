"use client";

/*import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import {IntervencionModel, ReferrerEnum, UsuarioModel} from "@/types";

const EditIntervencion = () => {
  const router = useRouter();
  const { id } = useParams();
  const [intervencion, setIntervencion] = useState<IntervencionModel | null>(null);;
  const [errors, setErrors] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (id) {
      const fetchIntervencion = async () => {
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/intervenciones/BuscarIntervencionPorId?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.user?.accessToken || ''),
          },
        });
        if (res.ok) {
          const result = await res.json();
          setIntervencion(result);
        } else {
          console.error("Error al obtener la intervención");
        }
      };
      fetchIntervencion();
    }
  }, [id, session]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    // @ts-ignore
    setIntervencion({estado: undefined, id: undefined, nombre: "", ...intervencion, [name]: value });
  };

  const validateForm = () => {
    const newErrors = [];
    // @ts-ignore
    if (!intervencion.nombre) newErrors.push("El nombre de la intervención es obligatorio");
    // @ts-ignore
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/intervenciones/modificar`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + (session?.user?.accessToken || ''),
        },
        body: JSON.stringify(intervencion),
      });

      if (res.ok) {
        router.push('/intervenciones');
      } else {
        const result = await res.json();
        // @ts-ignore
        setErrors([result.error]);
      }
    }
  };

  if (!intervencion) return <div>Cargando...</div>;
  if (!session) {signIn(); return null;}

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
      <div className='w-full p-4'>
        <form onSubmit={(e) => e.preventDefault()}>
          {errors.length > 0 && (
              <div className='bg-rose-200 p-2 mb-4'>
                <ul>
                  {errors.map((error, index) => (
                      <li key={index} className='text-red-700'>{error}</li>
                  ))}
                </ul>
              </div>
          )}
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Nombre de la Intervención:</label>
            <input
                type='text'
                name='nombre'
                value={intervencion.nombre}
                onChange={handleChange}
                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Estado:</label>
            <select
                name='estado'
                value={intervencion.estado}
                onChange={handleChange}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            >
              <option value={ReferrerEnum.ACTIVO}>Activo</option>
              <option value={ReferrerEnum.INACTIVO}>Inactivo</option>
            </select>
          </div>
          <button
              type='button'
              onClick={handleSubmit}
              className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700'
          >
            Guardar Cambios
          </button>
          <button
              type='button'
              onClick={() => router.push('/intervenciones')}
              className='px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700'
          >
            Cancelar
          </button>
        </form>
      </div>
      </div>
  );
};

export default EditIntervencion;*/

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IntervencionModel, ReferrerEnum } from '@/types';
import Image from "next/image";
import Link from "next/link";

const initialIntervenciones = [
    { id: 1, nombre: "Intervención A", estado: ReferrerEnum.ACTIVO },
    { id: 2, nombre: "Intervención B", estado: ReferrerEnum.INACTIVO },
    { id: 3, nombre: "Intervención C", estado: ReferrerEnum.ACTIVO }
];

const EditIntervencion = () => {
    const router = useRouter();
    const { id } = useParams();
    const [intervencion, setIntervencion] = useState({ id: null, nombre: '', estado: '' });
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const foundIntervencion = initialIntervenciones.find(i => i.id === Number(id));
        // @ts-ignore
        setIntervencion(foundIntervencion || { id: null, nombre: '', estado: '' });
    }, [id]);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setIntervencion({ ...intervencion, [name]: value });
    };

    const validateForm = () => {
        const newErrors = [];
        if (!intervencion.nombre) newErrors.push("El nombre es obligatorio");
        // @ts-ignore
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        alert('Cambios guardados (simulado)');
        router.push('/intervenciones'); // Redirigir al listado de intervenciones
    };

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
            <div className='flex flex-wrap items-start'>
                <div className='w-full p-4'>
                    <form onSubmit={(e) => e.preventDefault()}>
                        {errors.length > 0 && (
                            <div className='bg-rose-200 p-2 mb-4'>
                                <ul>
                                    {errors.map((error, index) => (
                                        <li key={index} className='text-rose-700'>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className='mb-4'>
                            <label className='block mb-2 text-sm font-medium text-gray-700'>Nombre de la Intervención:</label>
                            <input
                                type='text'
                                name='nombre'
                                value={intervencion.nombre}
                                onChange={handleChange}
                                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Estado:</label>
                            <select
                                name='estado'
                                value={intervencion.estado}
                                onChange={handleChange}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            >
                                <option value={ReferrerEnum.ACTIVO}>Activo</option>
                                <option value={ReferrerEnum.INACTIVO}>Inactivo</option>
                            </select>
                        </div>
                        <button
                            type='button'
                            onClick={handleSubmit}
                            className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700'
                        >
                            Guardar Cambios
                        </button>
                        <button
                            type='button'
                            onClick={() => router.push('/intervenciones')}
                            className='px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700'
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditIntervencion;
