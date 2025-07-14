"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import {FuncionalidadModel, ReferrerEnum} from "@/types";

const EditFuncionalidad = () => {
  const router = useRouter();
  const { id } = useParams();
  const [funcionalidad, setFuncionalidad] = useState<FuncionalidadModel | null>(null);;
  const [errors, setErrors] = useState([]);
  const { data: session, status } = useSession();

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

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFuncionalidad({estado: undefined, id: undefined, nombreFuncionalidad: "", ruta:"", ...funcionalidad, [name]: value });
  };

  const validateForm = () => {
    const newErrors = [];
    if (!funcionalidad.nombreFuncionalidad) newErrors.push("El nombre de la funcionalidad es obligatorio");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funcionalidades/modificar`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + (session.accessToken || ''),
        },
        body: JSON.stringify(funcionalidad),
      });

      if (res.ok) {
        router.push('/funcionalidades');
      } else {
        const result = await res.json();
        // @ts-ignore
        setErrors([result.error]);
      }
    }
  };

  if (!funcionalidad) return <div>Cargando...</div>;
  if (!session) {signIn(); return null;}

  return (
      <div className="flex flex-wrap items-start">
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
            <label className='block mb-2 text-sm font-medium text-neutral-700'>Nombre de la Funcionalidad:</label>
            <input
                type='text'
                name='nombreFuncionalidad'
                value={funcionalidad.nombreFuncionalidad}
                onChange={handleChange}
                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-neutral-700'>Ruta de la Funcionalidad:</label>
            <input
                type='text'
                name='ruta'
                value={funcionalidad.ruta}
                onChange={handleChange}
                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Estado:</label>
            <select
                name='estado'
                value={funcionalidad.estado}
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
              onClick={() => router.push('/funcionalidades')}
              className='px-4 py-2 ml-2 text-white bg-neutral-500 rounded hover:bg-neutral-700'
          >
            Cancelar
          </button>
        </form>
      </div>
      </div>
  );
};

export default EditFuncionalidad;