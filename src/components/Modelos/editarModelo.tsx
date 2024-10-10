"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import { ModeloModel, ReferrerEnum } from "@/types";

const EditModelo = () => {
  const router = useRouter();
  const { id } = useParams();
  const [modelo, setModelo] = useState<ModeloModel | null>(null);
  const [marcas, setMarcas] = useState([]);  // Estado para almacenar las marcas
  const [errors, setErrors] = useState<string[]>([]);
  const { data: session, status } = useSession();

  // Obtener el modelo por ID y la lista de marcas
  useEffect(() => {
    const fetchModeloYMarcas = async () => {
      if (id) {
        try {
          // Fetch del modelo
          const resModelo = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modelo/seleccionar?id=${id}`, {
            headers: {
              "Content-Type": "application/json",
              "authorization": "Bearer " + (session?.accessToken || ''),
            },
          });
          if (resModelo.ok) {
            const result = await resModelo.json();
            setModelo(result);
          } else {
            console.error("Error al obtener el modelo");
          }

          // Fetch de marcas
          const resMarcas = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marca/listar`, {
            headers: {
              "Content-Type": "application/json",
              "authorization": "Bearer " + (session?.accessToken || ''),
            },
          });
          if (resMarcas.ok) {
            const marcasData = await resMarcas.json();
            setMarcas(marcasData);  // Guardar las marcas en el estado
          } else {
            console.error("Error al obtener marcas");
          }
        } catch (error) {
          console.error("Error al cargar los datos", error);
        }
      }
    };
    fetchModeloYMarcas();
  }, [id, session]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setModelo({ ...modelo, [name]: value });
  };

  const handleSubmit = async () => {
    if (!modelo?.nombre) {
      setErrors(["El nombre del modelo es obligatorio"]);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modelo/modificar`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + (session?.accessToken || ''),
        },
        body: JSON.stringify(modelo),
      });

      if (res.ok) {
        router.push('/modelos');
      } else {
        const result = await res.json();
        setErrors([result.error]);
      }
    } catch (error) {
      console.error("Error al enviar los datos", error);
    }
  };

  if (!modelo) return <div>Cargando...</div>;
  if (!session) { signIn(); return null; }

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
                  <li key={index} className='text-rose-700'>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Campo de Nombre del Modelo */}
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Nombre del Modelo:</label>
            <input
              type='text'
              name='nombre'
              value={modelo.nombre}
              onChange={handleChange}
              className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500' disabled
            />
          </div>

          {/* Campo para seleccionar la Marca */}
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Marca:</label>
            <select
              name='idMarca'
              value={modelo.idMarca?.id || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value=''>Seleccione una Marca</option>
              {marcas.map((marca: any) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Campo para cambiar el estado */}
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Estado:</label>
            <select
              name='estado'
              value={modelo.estado}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            >
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

          {/* Botones para guardar y cancelar */}
          <button
            type='button'
            onClick={handleSubmit}
            className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700'
          >
            Guardar Cambios
          </button>
          <button
            type='button'
            onClick={() => router.push('/modelos')}
            className='px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700'
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModelo;
