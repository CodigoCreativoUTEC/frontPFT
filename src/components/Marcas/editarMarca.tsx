"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import {MarcaModel, ReferrerEnum, UsuarioModel} from "@/types/index";

const EditMarca = () => {
  const router = useRouter();
  const { id } = useParams();
  const [marca, setMarca] = useState<MarcaModel | null>(null);;
  const [errors, setErrors] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (id) {
      const fetchMarca = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marca/seleccionar?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.accessToken || ''),
          },
        });
        if (res.ok) {
          const result = await res.json();
          setMarca(result);
        } else {
          console.error("Error al obtener la marca");
        }
      };
      fetchMarca();
    }
  }, [id, session]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    // @ts-ignore
    setMarca({estado: undefined, id: undefined, nombre: "", ...marca, [name]: value });
  };

  const validateForm = () => {
    const newErrors = [];
    // @ts-ignore
    if (!marca.nombre) newErrors.push("El nombre de la marca es obligatorio");
    // @ts-ignore
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marca/modificar`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + (session?.accessToken || ''),
        },
        body: JSON.stringify(marca),
      });

      if (res.ok) {
        router.push('/marcas');
      } else {
        const result = await res.json();
        // @ts-ignore
        setErrors([result.error]);
      }
    }
  };

  if (!marca) return <div>Cargando...</div>;
  if (!session) {signIn(); return null;}

  return (
      <div className="flex flex-wrap items-start">
      <div className='w-full p-10'>
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
            <label className='block mb-2 text-sm font-medium text-neutral-700'>Nombre de la Marca:</label>
            <input
                type='text'
                name='nombre'
                value={marca.nombre}
                onChange={handleChange}
                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500' disabled
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Estado:</label>
            <select
                name='estado'
                value={marca.estado}
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
              onClick={() => router.push('/marcas')}
              className='px-4 py-2 ml-2 text-white bg-neutral-500 rounded hover:bg-neutral-700'
          >
            Cancelar
          </button>
        </form>
      </div>
      </div>
  );
};

export default EditMarca;