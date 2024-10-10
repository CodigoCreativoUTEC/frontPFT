// src/components/Proveedores/editarProveedor.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import { ProveedorModel, ReferrerEnum } from "@/types";
import CountrySelect from '../CountrySelect';

const EditProveedor = () => {
  const router = useRouter();
  const { id } = useParams();
  const [proveedor, setProveedor] = useState<ProveedorModel | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (id) {
      const fetchProveedor = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedores/seleccionar?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.accessToken || ''),
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

  const handleChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setProveedor(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleCountryChange = (country: { id: number; nombre: string }) => {
    setProveedor(prev => prev ? { ...prev, pais: country } : null);
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!proveedor?.nombre) newErrors.push("El nombre del proveedor es obligatorio");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedores/modificar`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + (session?.accessToken || ''),
        },
        body: JSON.stringify(proveedor),
      });

      if (res.ok) {
        router.push('/proveedores');
      } else {
        const result = await res.json();
        setErrors([result.error]);
      }
    }
  };

  if (!proveedor) return <div>Cargando...</div>;
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
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Nombre del Proveedor:</label>
            <input
              type='text'
              name='nombre'
              value={proveedor.nombre}
              onChange={handleChange}
              className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Pais del Proveedor:</label>
            <CountrySelect
              selectedCountry={proveedor.pais}
              onCountryChange={handleCountryChange}
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Estado:</label>
            <select
              name='estado'
              value={proveedor.estado}
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
            onClick={() => router.push('/proveedores')}
            className='px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700'
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProveedor;