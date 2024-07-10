"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UsuarioModel, ReferrerEnum } from '@/types';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const EditUsuario = () => {
  const router = useRouter();
  const { id } = useParams();
  const [usuario, setUsuario] = useState<UsuarioModel | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const fetchUsuario = async () => {
        const res = await fetch(`/api/usuarios/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const result = await res.json();
          setUsuario(result);
        } else {
          console.error("Error al obtener el usuario");
        }
      };
      fetchUsuario();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (usuario) {
      const { name, value } = e.target;
      setUsuario({ ...usuario, [name]: value });
    }
  };

  const handleTelefonoChange = (index: number, value: string) => {
    if (usuario) {
      if (Array.isArray(usuario.telefono)) {
        const newTelefonos = [...usuario.telefono];
        newTelefonos[index] = value;
        setUsuario({ ...usuario, telefono: newTelefonos });
      } else {
        const newTelefonos = { ...usuario.telefono, [index]: value };
        setUsuario({ ...usuario, telefono: newTelefonos });
      }
    }
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!usuario?.nombre) newErrors.push("Nombre es obligatorio");
    if (!usuario?.apellido) newErrors.push("Apellido es obligatorio");
    if (!usuario?.cedula) newErrors.push("Cédula es obligatoria");
    if (!usuario?.fecha_nasc) newErrors.push("Fecha de nacimiento es obligatoria");
    if (!usuario?.telefono || (Array.isArray(usuario.telefono) && usuario.telefono.some(tel => !tel))) newErrors.push("Teléfono de contacto es obligatorio");
    if (!usuario?.email) newErrors.push("Email es obligatorio");
    if (usuario?.email && !/\S+@\S+\.\S+/.test(usuario.email)) newErrors.push("Formato de email no válido");
    if (!usuario?.tipo_usuario) newErrors.push("Tipo de usuario es obligatorio");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usuario && validateForm()) {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });
      if (res.ok) {
        router.push('/usuarios');
      } else {
        console.error("Error al actualizar el usuario");
      }
    } else {
      setShowModal(true);
    }
  };

  if (!usuario) return <div>...loading</div>;

  return (
    <DefaultLayout>
      <div className='container mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Editar Usuario</h1>
        <form className='bg-white p-4 rounded shadow-md' onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className='bg-red-200 p-2 mb-4'>
              <ul>
                {errors.map((error, index) => (
                  <li key={index} className='text-red-700'>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Nombre:</label>
            <input
              type='text'
              name='nombre'
              value={usuario.nombre}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Apellido:</label>
            <input
              type='text'
              name='apellido'
              value={usuario.apellido}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Cédula:</label>
            <input
              type='text'
              name='cedula'
              value={usuario.cedula}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Fecha de Nacimiento:</label>
            <input
              type='date'
              name='fecha_nasc'
              value={new Date(usuario.fecha_nasc).toISOString().split('T')[0]}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Teléfonos:</label>
            {Array.isArray(usuario.telefono) ? (
              usuario.telefono.map((tel, index) => (
                <input
                  key={index}
                  type='text'
                  name={`telefono_${index}`}
                  value={tel}
                  onChange={(e) => handleTelefonoChange(index, e.target.value)}
                  className='w-full p-2 border rounded mb-2'
                />
              ))
            ) : (
              Object.entries(usuario.telefono).map(([key, value], index) => (
                <input
                  key={key}
                  type='text'
                  name={`telefono_${key}`}
                  value={value as string}
                  onChange={(e) => handleTelefonoChange(Number(key), e.target.value)}
                  className='w-full p-2 border rounded mb-2'
                />
              ))
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Email:</label>
            <input
              type='email'
              name='email'
              value={usuario.email}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Tipo de Usuario:</label>
            <select
              name='tipo_usuario'
              value={usuario.tipo_usuario}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value="">Seleccione un tipo de usuario</option>
              <option value={ReferrerEnum.ADMIN}>Admin</option>
              <option value={ReferrerEnum.AUXILIAR_ADMINISTRATIVO}>Auxiliar Administrativo</option>
              <option value={ReferrerEnum.INGENIERO_BIOMEDICO}>Ingeniero Biomédico</option>
              <option value={ReferrerEnum.TECNICO}>Técnico</option>
              <option value={ReferrerEnum.TECNOLOGO}>Tecnólogo</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Estado:</label>
            <select
              name='estado'
              value={usuario.estado}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value={ReferrerEnum.ACTIVO}>Activo</option>
              <option value={ReferrerEnum.INACTIVO}>Inactivo</option>
              <option value={ReferrerEnum.PENDIENTE}>Pendiente</option>
            </select>
          </div>
          <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
            Guardar
          </button>
        <button
          onClick={() => router.push('/usuarios')}
          className='mt-4 ml-4 bg-gray-500 text-white bg-violet-800 p-2 rounded'
        >
          Volver
        </button>
        </form>

        {showModal && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-4 rounded shadow-md'>
              <h2 className='text-xl mb-4'>Errores en el formulario</h2>
              <ul className='list-disc list-inside'>
                {errors.map((error, index) => (
                  <li key={index} className='text-red-600'>{error}</li>
                ))}
              </ul>
              <button
                onClick={() => setShowModal(false)}
                className='mt-4 bg-blue-500 text-white p-2 rounded'
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default EditUsuario;
