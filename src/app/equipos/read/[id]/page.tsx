"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EquipoModel } from '@/types';
import DefaultLayout from '@/components/Layouts/DefaultLayout';



const EquipoDetail = () => {
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

  if (!equipo) return <div>...loading</div>;

  return (
    <DefaultLayout>
      <div className='container mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Detalles del Equipo</h1>
        <div className='bg-white p-4 rounded shadow-md'>
          <p><strong>ID:</strong> {equipo.id}</p>
          <p><strong>Nombre:</strong> {equipo.nombre}</p>
          <p><strong>Imagen:</strong> {equipo.imagen}</p>
          <p><strong>Marca:</strong> {equipo.marca}</p>
          <p><strong>Modelo:</strong> {equipo.modelo}</p>
          <p><strong>Número de Serie:</strong> {equipo.num_serie}</p>
          <p><strong>Garantía:</strong> {equipo.garantia}</p>
          <p><strong>País:</strong> {equipo.pais}</p>
          <p><strong>Proveedor:</strong> {equipo.proveedor}</p>
          <p><strong>Fecha de Adquirido:</strong> {new Date(equipo.fecha_adq).toLocaleDateString()}</p>
          <p><strong>ID Interno:</strong> {equipo.id_interno}</p>
          <p><strong>Ubicación:</strong> {equipo.ubicacion}</p>
          <p><strong>Tipo de Equipo:</strong> {equipo.tipo_equipo}</p>
          <p><strong>Estado:</strong> {equipo.estado}</p>
        </div>
        <button
          onClick={() => router.push('/equipos')}
          className='mt-4 bg-blue-500 text-white p-2 rounded'
        >
          Volver
        </button>
      </div>
    </DefaultLayout>
  );
}

export default EquipoDetail;