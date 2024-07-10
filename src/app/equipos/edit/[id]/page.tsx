"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EquipoModel, ReferrerEnum } from '@/types';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from '@/types/emuns';

const EditEquipo = () => {
  const router = useRouter();
  const { id } = useParams();
  const [equipo, setEquipo] = useState<EquipoModel | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEquipo = async () => {
        const res = await fetch(`/api/equipos/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const result = await res.json();
          setEquipo(result);
        } else {
          console.error("Error al obtener el equipo");
        }
      };
      fetchEquipo();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (equipo) {
      const { name, value } = e.target;
      setEquipo({ ...equipo, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (equipo) {
      const res = await fetch(`/api/equipos/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipo),
      });
      if (res.ok) {
        router.push('/equipos');
      } else {
        console.error("Error al actualizar el equipo");
      }
    }
  };

  if (!equipo) return <div>...loading</div>;

  return (
    <DefaultLayout>
      <div className='container mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Editar Eequipo</h1>
        <form className='bg-white p-4 rounded shadow-md' onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Nombre:</label>
            <input
              type='text'
              name='nombre'
              value={equipo.nombre}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Tipo de Equipo:</label>
            <select
              name='tipo_equipo'
              value={equipo.tipo_equipo}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value={Tipo.DIGITAL}>Digital</option>
              <option value={Tipo.MECANICO}>Mecánico</option>
              
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Marca:</label>
            <select
              name='marca'
              value={equipo.marca}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value={Marca.LG}>Lg</option>
              <option value={Marca.MOTOROLA}>Motorola</option>
              
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Modelo:</label>
            <select
              name='modelo'
              value={equipo.modelo}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value={Modelo.HD}>HD</option>
              <option value={Modelo.U4K}>U4K</option>
              
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Número de Serie:</label>
            <input
              type='number'
              name='num_serie'
              value={equipo.num_serie}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Garantía:</label>
            <input
              type='number'
              name='garantia'
              value={equipo.garantia}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>País:</label>
            <select
              name='pais'
              value={equipo.pais}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value={Pais.BRASIL}>Brasil</option>
              <option value={Pais.URUGUAY}>Uruguay</option>
              
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Proveedor:</label>
            <select
              name='proveedor'
              value={equipo.proveedor}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value={Proveedor.DISTRICOMP}>Districomp</option>
              <option value={Proveedor.LOI}>Loi</option>
              
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Fecha de Adquisición:</label>
            <input
              type='date'
              name='fecha_adq'
              value={new Date(equipo.fecha_adq).toISOString().split('T')[0]}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>ID Interno:</label>
            <input
              type='text'
              name='id_interno'
              value={equipo.id_interno}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Ubicación:</label>
            <select
              name='ubicacion'
              value={equipo.ubicacion}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value={Ubicacion.CTI}>CTI</option>
              <option value={Ubicacion.SALA1}>Sala 1</option>
              
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Imagen:</label>
            <input
              type='text'
              name='imagen'
              value={equipo.imagen}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Estado:</label>
            <select
              name='estado'
              value={equipo.estado}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value={ReferrerEnum.ACTIVO}>Activo</option>
              <option value={ReferrerEnum.INACTIVO}>Inactivo</option>
              
            </select>
          </div>
          <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
            Guardar
          </button>
        </form>
        <button
          onClick={() => router.push('/equipos')}
          className='mt-4 bg-gray-500 text-white p-2 rounded'
        >
          Volver
        </button>
      </div>
    </DefaultLayout>
  );
}

export default EditEquipo;
