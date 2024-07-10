"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UsuarioModel, ReferrerEnum } from '@/types';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const EditUsuario = () => {
  const router = useRouter();
  const { id } = useParams();
  const [usuario, setUsuario] = useState<UsuarioModel | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usuario) {
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
    }
  };

  if (!usuario) return <div>...loading</div>;

  return (
    <DefaultLayout>
      <div className='container mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Editar Usuario</h1>
        <form className='bg-white p-4 rounded shadow-md' onSubmit={handleSubmit}>
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
            <label className='block text-sm font-bold mb-2'>Nombre de Usuario:</label>
            <input
              type='text'
              name='nombre_usuario'
              value={usuario.nombre_usuario}
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
        </form>
        <button
          onClick={() => router.push('/usuarios')}
          className='mt-4 bg-gray-500 text-white p-2 rounded'
        >
          Volver
        </button>
      </div>
    </DefaultLayout>
  );
}

export default EditUsuario;
