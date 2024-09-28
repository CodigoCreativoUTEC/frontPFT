"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

interface Funcionalidad {
  id: number;
  nombreFuncionalidad: string;
  estado: string;
  perfiles: { id: number; nombrePerfil: string; estado: string }[];
}

interface FuncionalidadSelect {
  id: number;
  nombreFuncionalidad: string;
}

interface ProfileCheckbox {
  id: number;
  nombrePerfil: string;
  checked: boolean;
}

const ModificarAccesoFuncionalidades = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [funcionalidades, setFuncionalidades] = useState<FuncionalidadSelect[]>([]);
  const [selectedFuncionalidad, setSelectedFuncionalidad] = useState<Funcionalidad | null>(null);
  const [profiles, setProfiles] = useState<ProfileCheckbox[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Fetch de funcionalidades (para seleccionar una de la lista)
  useEffect(() => {
    const fetchFuncionalidades = async () => {
      try {
        const res = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/funcionalidades/listar", {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.accessToken || ''),
          },
        });

        if (res.ok) {
          const result = await res.json();
          setFuncionalidades(result);
        } else {
          console.error("Error al obtener las funcionalidades");
        }
      } catch (error) {
        console.error("Error en la solicitud de funcionalidades:", error);
      }
    };

    if (session) fetchFuncionalidades();
  }, [session]);

  // Fetch de perfiles cuando se selecciona una funcionalidad
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!selectedFuncionalidad) return;

      try {
        const res = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/perfiles/listar", {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.accessToken || ''),
          },
        });

        if (res.ok) {
          const result = await res.json();

          // Aquí comparamos los perfiles de la funcionalidad seleccionada y los perfiles generales
          setProfiles(result.map((profile: any) => ({
            id: profile.id,
            nombrePerfil: profile.nombrePerfil,
            checked: selectedFuncionalidad.perfiles.some(p => p.id === profile.id), // Marcar los perfiles que ya tienen acceso
          })));
        } else {
          console.error("Error al obtener los perfiles");
        }
      } catch (error) {
        console.error("Error en la solicitud de perfiles:", error);
      }
    };

    if (selectedFuncionalidad) fetchProfiles();
  }, [selectedFuncionalidad, session]);

  // Manejador del cambio de selección de la funcionalidad
  const handleFuncionalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value, 10);
    const selected = funcionalidades.find(func => func.id === selectedId);

    // Establece la funcionalidad seleccionada completa (incluyendo perfiles) para su manipulación
    setSelectedFuncionalidad(selected || null);
  };

  // Manejador del cambio de checkboxes para los perfiles
  const handleProfileChange = (id: number) => {
    setProfiles(prev =>
      prev.map(profile =>
        profile.id === id ? { ...profile, checked: !profile.checked } : profile
      )
    );
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!selectedFuncionalidad) newErrors.push("Debe seleccionar una funcionalidad");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const updatedPerfiles = profiles
      .filter(profile => profile.checked) // Solo enviar los perfiles seleccionados
      .map(profile => ({ id: profile.id, nombrePerfil: profile.nombrePerfil }));

    const updatedFuncionalidad = {
      id: selectedFuncionalidad?.id,
      nombreFuncionalidad: selectedFuncionalidad?.nombreFuncionalidad || '',
      estado: selectedFuncionalidad?.estado || 'ACTIVO',
      perfiles: updatedPerfiles,
    };

    try {
      const res = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/funcionalidades/modificar", {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + (session?.accessToken || ''),
        },
        body: JSON.stringify(updatedFuncionalidad),
      });

      if (res.ok) {
        router.push("/funcionalidades");
      } else {
        const result = await res.json();
        setErrors([result.error || "Error desconocido"]);
      }
    } catch (error) {
      console.error("Error en la solicitud de modificación:", error);
    }
  };

  if (!session) { signIn(); return null; }

  return (
    <div className="w-full p-4">
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
          <label className='block mb-2 text-sm font-medium text-gray-700'>Funcionalidad:</label>
          <select
            value={selectedFuncionalidad ? selectedFuncionalidad.id : ''}
            onChange={handleFuncionalidadChange}
            className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
          >
            <option value=''>Seleccione una funcionalidad</option>
            {funcionalidades.map(func => (
              <option key={func.id} value={func.id}>
                {func.nombreFuncionalidad}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-2 text-sm font-medium text-gray-700'>Perfiles:</label>
          {profiles.map(profile => (
            <div key={profile.id} className='flex items-center'>
              <input
                type='checkbox'
                checked={profile.checked}
                onChange={() => handleProfileChange(profile.id)}
                className='mr-2'
              />
              <label>{profile.nombrePerfil}</label>
            </div>
          ))}
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
          className='px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700'
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default ModificarAccesoFuncionalidades;
