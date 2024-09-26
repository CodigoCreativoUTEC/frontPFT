"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { IntervencionModel, IntervencionTipo, EquipoModel } from "@/types/index"; // Asegúrate de tener los tipos correctos

const CrearIntervencion = () => {
  const router = useRouter();
  const [intervencion, setIntervencion] = useState<Partial<IntervencionModel>>({
    motivo: '',
    comentarios: '',
    fechaHora: [],
    idTipo: null,
    idEquipo: null
  });
  const [tiposIntervencion, setTiposIntervencion] = useState<IntervencionTipo[]>([]);
  const [equipos, setEquipos] = useState<EquipoModel[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) { signIn(); return; }

    const fetchData = async () => {
      try {
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

        // Fetch the list of equipos (devices)
        const resEquipos = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/equipos/ListarTodosLosEquipos", {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.accessToken || ''),
          },
        });
        if (resEquipos.ok) {
          const equiposData = await resEquipos.json();
          setEquipos(equiposData);
        } else {
          console.error("Error al obtener los equipos");
        }
      } catch (error) {
        console.error("Error en la carga de datos:", error);
      }
    };

    fetchData();
  }, [session]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setIntervencion({ ...intervencion, [name]: value });
  };

  const handleDateChange = (e: { target: { value: string; }; }) => {
    const dateValue = new Date(e.target.value);
    setIntervencion({
      ...intervencion,
      fechaHora: [
        dateValue.getFullYear(),
        dateValue.getMonth() + 1, // El mes en Date es 0-indexed
        dateValue.getDate(),
        dateValue.getHours(),
        dateValue.getMinutes()
      ],
    });
  };

  const handleTipoChange = (e: { target: { value: string; }; }) => {
    const selectedTipoId = parseInt(e.target.value);
    const selectedTipo = tiposIntervencion.find(tipo => tipo.id === selectedTipoId);
    setIntervencion({
      ...intervencion,
      idTipo: selectedTipo
    });
  };

  const handleEquipoChange = (e: { target: { value: string; }; }) => {
    const selectedEquipoId = parseInt(e.target.value);
    const selectedEquipo = equipos.find(equipo => equipo.id === selectedEquipoId);
    setIntervencion({
      ...intervencion,
      idEquipo: selectedEquipo
    });
  };

  const validateForm = () => {
    const newErrors = [];
    if (!intervencion?.motivo) newErrors.push("El motivo de la intervención es obligatorio");
    if (!intervencion?.idTipo) newErrors.push("El tipo de intervención es obligatorio");
    if (!intervencion?.idEquipo) newErrors.push("El equipo es obligatorio");
    if (!intervencion?.fechaHora || intervencion.fechaHora.length === 0) newErrors.push("La fecha y hora son obligatorias");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Agregar el idUsuario desde la sesión
        const dataToSend = {
          ...intervencion,
          idUsuario: { id: session.user.id }, // Asignar el usuario desde la sesión
        };

        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/intervencion/crear`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.accessToken || ''),
          },
          body: JSON.stringify(dataToSend),
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

  if (!session) { signIn(); return null; }

  return (
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
                onChange={handleDateChange}
                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>

          {/* Campo de tipo de intervención */}
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Tipo de intervención:</label>
            <select
              name='idTipo'
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

          {/* Campo de identificación del equipo */}
          <div className='mb-4'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>Equipo:</label>
            <select
              name='idEquipo'
              onChange={handleEquipoChange}
              className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value="">Seleccione un equipo</option>
              {equipos.map(equipo => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.idInterno} - {equipo.nombre}
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
            Guardar Intervención
          </button>
          <button
              type='button'
              onClick={() => router.push('/intervenciones')}
              className='px-4 py-2 ml-2 text-white bg-green-500 rounded hover:bg-green-700'
          >
            Cancelar
          </button>
        </form>
      </div>
  );
};

export default CrearIntervencion;
