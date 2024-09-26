"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import { IntervencionModel, IntervencionTipo } from "@/types"; // Asegúrate de tener el tipo IntervencionTipo definido

const EditIntervencion = () => {
  const router = useRouter();
  const { id } = useParams();
  const [intervencion, setIntervencion] = useState<IntervencionModel | null>(null);
  const [tiposIntervencion, setTiposIntervencion] = useState<IntervencionTipo[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) { signIn(); return; }
    
    const fetchData = async () => {
      try {
        // Fetch the intervention data
        if (id) {
          const resIntervencion = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/intervencion/buscarPorId?id=${id}`, {
            headers: {
              "Content-Type": "application/json",
              "authorization": "Bearer " + (session?.accessToken || ''),
            },
          });
          if (resIntervencion.ok) {
            const result = await resIntervencion.json();
            setIntervencion(result);
          } else {
            console.error("Error al obtener la intervención");
          }
        }

        // Fetch the types of interventions
        const resTipos = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/tipoIntervenciones/listarTodos", {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.accessToken || ''),
          },
        });
        if (resTipos.ok) {
          const tiposData = await resTipos.json();
          setTiposIntervencion(tiposData);
        } else {
          console.error("Error al obtener los tipos de intervención");
        }
      } catch (error) {
        console.error("Error en la carga de datos:", error);
      }
    };

    fetchData();
  }, [id, session]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setIntervencion({ ...intervencion, [name]: value });
  };

  const handleDateChange = (e: { target: { value: string; }; }) => {
    const dateValue = new Date(e.target.value);
    if (intervencion) {
      setIntervencion({
        ...intervencion,
        fechaHora: [
          dateValue.getFullYear(),
          dateValue.getMonth() + 1,
          dateValue.getDate(),
          dateValue.getHours(),
          dateValue.getMinutes()
        ],
      });
    }
  };

  const handleTipoChange = (e: { target: { value: string; }; }) => {
    const selectedTipoId = parseInt(e.target.value);
    const selectedTipo = tiposIntervencion.find(tipo => tipo.id === selectedTipoId);
    if (intervencion && selectedTipo) {
      setIntervencion({
        ...intervencion,
        idTipo: selectedTipo
      });
    }
  };

  const validateForm = () => {
    const newErrors = [];
    if (!intervencion?.motivo) newErrors.push("El motivo de la intervención es obligatorio");
    if (!intervencion?.idTipo) newErrors.push("El tipo de intervención es obligatorio");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/intervencion/modificar`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.accessToken || ''),
          },
          body: JSON.stringify(intervencion),
        });

        if (res.ok) {
          router.push('/intervenciones');
        } else {
          const result = await res.json();
          setErrors([result.error]);
        }
      } catch (error) {
        console.error("Error al enviar los datos:", error);
        setErrors(["Error al enviar los datos"]);
      }
    }
  };

  if (!intervencion) return <div>Cargando...</div>;
  if (!session) { signIn(); return null; }

  // Evitar el uso de toISOString si la fecha no está lista
  let formattedDate = "";
  if (intervencion.fechaHora && intervencion.fechaHora.length === 5) {
    const [year, month, day, hour, minute] = intervencion.fechaHora;
    const dateObj = new Date(year, month - 1, day, hour, minute); // Crear objeto Date con la fecha actual
    formattedDate = dateObj.toISOString().slice(0, 16); // Formato adecuado para <input type='datetime-local'>
  }

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

          {/* Campo de fecha y hora */}
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Fecha y hora de la intervención:</label>
            <input
                type='datetime-local'
                name='fechaHora'
                value={formattedDate} // Fecha formateada
                onChange={handleDateChange} // Cambiar la fecha correctamente
                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>

          {/* Campo de tipo de intervención */}
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Tipo de intervención:</label>
            <select
              name='idTipo'
              value={intervencion.idTipo?.id || ''}
              onChange={handleTipoChange}
              className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value="">Seleccione un tipo de intervención</option>
              {tiposIntervencion.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombreTipo}
                </option>
              ))}
            </select>
          </div>

          {/* Campo de motivo */}
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Motivo:</label>
            <input
                type='text'
                name='motivo'
                value={intervencion.motivo}
                onChange={handleChange}
                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>

          {/* Campo de observaciones */}
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Observaciones:</label>
            <textarea
                name='comentarios'
                value={intervencion.comentarios}
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
  );
};

export default EditIntervencion;
