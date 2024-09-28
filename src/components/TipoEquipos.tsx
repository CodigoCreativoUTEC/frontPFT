import React, { useState } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { TipoEquipoModel } from "@/types"; // Cambiado a TipoEquipoModel

interface TipoEquiposListProps extends TipoEquipoModel {
    fetcher: () => void;  // La función que refresca la lista de equipos
}

const TipoEquiposList: React.FC<TipoEquiposListProps> = (params) => {
    const { data: session, status } = useSession();
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [tipoEquipoIdToDelete, setTipoEquipoIdToDelete] = useState<number | null>(null);

    // Manejo de la sesión
    if (status === 'loading') return <div>Cargando...</div>;
    if (!session) {
        signIn(); // Redirige a la página de login si no está autenticado
        return null;
    }

    // Maneja la confirmación de eliminar
    const handleDeleteClick = (id: number | null) => {
        setTipoEquipoIdToDelete(id);
        setShowConfirmModal(true);
    };

    // Función para inactivar (borrar) el tipo de equipo
    const borrarTipoEquipo = async () => {
        if (tipoEquipoIdToDelete === null) return;

        try {
            // Petición al backend para inactivar el tipo de equipo
            const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/tipoEquipos/inactivar?id=${tipoEquipoIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${session?.accessToken || ''}`,  // Agregar el token de autenticación
                },
            });

            // Manejo del resultado
            if (res.ok) {
                console.log('Tipo de equipo inactivado correctamente'); // Debugging
                params.fetcher(); // Refrescar la lista después de una eliminación exitosa
            } else {
                const errorData = await res.json();
                console.error('Error del servidor:', errorData);
                alert('Error al inactivar el tipo de equipo.');
            }
        } catch (error) {
            console.error('Error al eliminar tipo de equipo:', error);
            alert('Ocurrió un error. Intenta nuevamente.');
        } finally {
            setShowConfirmModal(false);  // Cerrar el modal de confirmación
            setTipoEquipoIdToDelete(null);  // Resetear el id seleccionado
        }
    };

    return (
        <>
            <tr className="border-b text-black bold dark:border-neutral-500 odd:bg-blue-200 dark:odd:bg-slate-700 dark:even:bg-slate-500 dark:odd:text-bodydark2">
                <td className='px-8 py-3'>{params.id}</td>
                <td className='px-8 py-3'>{params.nombreTipo}</td>
                <td className='px-8 py-3'>{params.estado}</td>
                <td className='px-8 py-3'>
                    <div className="inline-flex">
                        <span
                            className='bg-rose-500 p-1 inline-block ml-1 text-white text-xs rounded cursor-pointer'
                            onClick={() => handleDeleteClick(params.id)}>
                            Eliminar
                        </span>
                        <span className='bg-yellow-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer'>
                            <Link href={`/tipo_equipo/edit/${params.id}`}>
                                Editar
                            </Link>
                        </span>
                        <span className='bg-blue-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer'>
                            <Link href={`/tipo_equipo/read/${params.id}`}>
                                Detalles
                            </Link>
                        </span>
                    </div>
                </td>
            </tr>

            {/* Modal de confirmación */}
            {showConfirmModal && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
                        <h2 className='text-xl mb-4'>Confirmar eliminación</h2>
                        <p>¿Estás seguro de que deseas inactivar este tipo de equipo?</p>
                        <div className='mt-4'>
                            <button
                                onClick={borrarTipoEquipo}
                                className='bg-green-500 text-white p-2 rounded mr-4'
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className='bg-violet-800 text-white p-2 rounded'
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TipoEquiposList;
