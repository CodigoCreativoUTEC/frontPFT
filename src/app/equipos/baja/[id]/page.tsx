"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BajaEquipoModel } from '@/types';
import DefaultLayout from '@/components/Layouts/DefaultLayout';



const BajaEquipoDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [bajaEquipo, setBajaEquipo] = useState<BajaEquipoModel | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBajaEquipo = async () => {
        const res = await fetch(`/api/equipos/baja/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const result = await res.json();
          setBajaEquipo(result);
        } else {
          console.error("Error al obtener el equipo");
        }
      };
      fetchBajaEquipo();
    }
  }, [id]);

  if (!bajaEquipo) return <div>...loading</div>;

  return (
    <DefaultLayout>
      <div className='container mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Detalles del Equipo</h1>
        <div className='bg-white p-4 rounded shadow-md'>
          <p><strong>ID:</strong> {bajaEquipo.id}</p>
          <p><strong>Nombre:</strong> {bajaEquipo.nombre}</p>
          <p><strong>Fecha de Baja:</strong> {new Date(bajaEquipo.fecha_baja).toLocaleDateString()}</p>
          <p><strong>Usuario:</strong> {bajaEquipo.usuario}</p>
          <p><strong>Razón:</strong> {bajaEquipo.razon}</p>
          <p><strong>Comentarios:</strong> {bajaEquipo.comentarios}</p>
          <p><strong>Estado:</strong> {bajaEquipo.estado}</p>
        </div>
        <button
          onClick={() => router.push('/equipos/baja')}
          className='mt-4 bg-blue-500 text-white p-2 rounded'
        >
          Volver
        </button>
      </div>
    </DefaultLayout>
  );
}

export default BajaEquipoDetail;