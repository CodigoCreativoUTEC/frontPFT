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
import {IntervencionModel, ReferrerEnum, TipoIntervencionEnum} from '@/types';
import Image from "next/image";
import Link from "next/link";

// Datos de ejemplo hardcodeados para pruebas
const initialIntervenciones: IntervencionModel[] = [
    { id: 1, tipo: TipoIntervencionEnum.PREVENCION, fechaIntervencion: "2023-09-01T10:00", motivo: "Mantenimiento preventivo", equipoId: "EQ001", observaciones: "N/A" },
    { id: 2, tipo: TipoIntervencionEnum.FALLA, fechaIntervencion: "2023-09-10T15:30", motivo: "Reparación por falla", equipoId: "EQ002", observaciones: "Se cambió una pieza" },
    { id: 3, tipo: TipoIntervencionEnum.RESOLUCION, fechaIntervencion: "2023-10-01T08:45", motivo: "Revisión final", equipoId: "EQ003", observaciones: "Todo en orden" }
];

const EditIntervencion = () => {
    const router = useRouter();
    const { id } = useParams();
    const [intervencion, setIntervencion] = useState<IntervencionModel | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const foundIntervencion = initialIntervenciones.find(i => i.id === Number(id));

        if (foundIntervencion) {
            setIntervencion(foundIntervencion);
        } else {
            setIntervencion(null); // Si no se encuentra, puedes manejar el error o dejar null
        }
    }, [id]);



    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        if (intervencion) {
            setIntervencion({ ...intervencion, [name]: value });
        }
    };

    const validateForm = () => {
        const newErrors: string[] = [];
        if (!intervencion?.tipo) newErrors.push("El tipo de intervención es obligatorio");
        if (!intervencion?.fechaIntervencion) newErrors.push("La fecha/hora de la intervención es obligatoria");
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        alert('Cambios guardados (simulado)');
        router.push('/intervenciones'); // Redirigir al listado de intervenciones
    };

    if (!intervencion) return <p>Cargando intervención...</p>;

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

                        {/* Campo no editable para el ID del Equipo */}
                        <div className='mb-4'>
                            <label className='block mb-2 text-sm font-medium text-gray-700'>Identificación del Equipo:</label>
                            <input
                                type='text'
                                name='equipoId'
                                value={intervencion.equipoId}
                                className='w-full p-2 border rounded shadow-sm bg-gray-200'
                                disabled
                            />
                        </div>

                        {/* Fecha/hora de la intervención */}
                        <div className='mb-4'>
                            <label className='block mb-2 text-sm font-medium text-gray-700'>Fecha/hora de la Intervención:</label>
                            <input
                                type='datetime-local'
                                name='fechaIntervencion'
                                value={intervencion.fechaIntervencion}
                                onChange={handleChange}
                                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            />
                        </div>

                        {/* Tipo de intervención */}
                        <div className='mb-4'>
                            <label className='block mb-2 text-sm font-medium text-gray-700'>Tipo de Intervención:</label>
                            <select
                                name='tipo'
                                value={intervencion.tipo}
                                onChange={handleChange}
                                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            >
                                <option value="Prevención">Prevención</option>
                                <option value="Falla">Falla</option>
                                <option value="Resolución">Resolución</option>
                            </select>
                        </div>

                        {/* Motivo (opcional) */}
                        <div className='mb-4'>
                            <label className='block mb-2 text-sm font-medium text-gray-700'>Motivo (opcional):</label>
                            <input
                                type='text'
                                name='motivo'
                                value={intervencion.motivo}
                                onChange={handleChange}
                                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            />
                        </div>

                        {/* Observaciones (opcional) */}
                        <div className='mb-4'>
                            <label className='block mb-2 text-sm font-medium text-gray-700'>Observaciones (opcional):</label>
                            <input
                                type='text'
                                name='observaciones'
                                value={intervencion.observaciones || ''}
                                onChange={handleChange}
                                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            />
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
