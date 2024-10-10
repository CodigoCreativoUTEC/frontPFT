"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

const CrearPerfil = () => {
  const router = useRouter();
  const [nombrePerfil, setNombrePerfil] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const { data: session, status } = useSession();

  // Manejar cambio de nombre de perfil
  const handleChange = (e: { target: { value: string } }) => {
    setNombrePerfil(e.target.value);
  };

  // Validar el formulario
  const validateForm = () => {
    const newErrors = [];
    if (!nombrePerfil.trim()) newErrors.push("El nombre del perfil es obligatorio");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perfiles/crear`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.accessToken || ''), // Obtener el token de sesión
          },
          body: JSON.stringify({ nombrePerfil }), // Enviar el campo nombrePerfil
        });

        if (res.ok) {
          router.push('/perfiles'); // Redirigir a la lista de perfiles o página correspondiente
        } else {
          const result = await res.json();
          setErrors([result.error]);
        }
      } catch (error) {
        console.error("Error al crear el perfil:", error);
        setErrors(["Error al crear el perfil"]);
      }
    }
  };

  // Si el usuario no está autenticado
  if (!session) { signIn(); return null; }

  return (
    <div className="w-full p-4">
      <form onSubmit={(e) => e.preventDefault()}>
        {errors.length > 0 && (
          <div className="bg-rose-200 p-2 mb-4">
            <ul>
              {errors.map((error, index) => (
                <li key={index} className="text-red-700">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Campo de nombre de perfil */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Nombre del Perfil:</label>
          <input
            type="text"
            name="nombrePerfil"
            value={nombrePerfil}
            onChange={handleChange}
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ingrese el nombre del perfil"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Crear Perfil
        </button>
        <button
          type="button"
          onClick={() => router.push('/perfiles')}
          className="px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default CrearPerfil;
