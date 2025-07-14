import React, { useState } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

const FuncionalidadesList: React.FC<FuncionalidadesListProps> = (params) => {
    const { data: session } = useSession();
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [funcionalidadIdToDelete, setFuncionalidadIdToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number | null) => {
        setFuncionalidadIdToDelete(id);
        setShowConfirmModal(true);
    };

    const borrarFuncionalidad = async () => {
        if (funcionalidadIdToDelete === null) return;

        try {
            const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/funcionalidades/inactivar?id=${funcionalidadIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + (session?.accessToken ?? ''),
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al eliminar la funcionalidad');
            }

            if (!session) { signIn(); return null; }

            params.fetcher();  // Refresh the list after deletion
        } catch (error) {
            console.error('Error al eliminar funcionalidad:', error);
        } finally {
            setShowConfirmModal(false);
            setFuncionalidadIdToDelete(null);
        }
    };

    return (
        <>
            <tr className="border-b text-black bold dark:border-neutral-500 odd:bg-blue-200 dark:odd:bg-slate-700 dark:even:bg-slate-500 dark:odd:text-bodydark2">
                <td className='px-8 py-3'>{params.id}</td>
                <td className='px-8 py-3'>{params.nombreFuncionalidad}</td>
                <td className='px-8 py-3'>{params.estado}</td>
                <td className='px-8 py-3'>
                    <div className="inline-flex">
                        <button
                            className='bg-rose-500 p-1 inline-block ml-1 text-white text-xs rounded cursor-pointer'
                            onClick={() => handleDeleteClick(params.id)}>
                            Eliminar
                        </button>
                        <span className='bg-yellow-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer'>
                            <Link href={`/funcionalidades/edit/${params.id}`}>
                                Editar
                            </Link>
                        </span>
                        <span className='bg-blue-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer'>
                            <Link href={`/funcionalidades/read/${params.id}`}>
                                Detalles
                            </Link>
                        </span>
                    </div>
                </td>
            </tr>

            {showConfirmModal && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
                        <h2 className='text-xl mb-4'>Confirmar eliminación</h2>
                        <p>¿Estás seguro de que deseas eliminar esta funcionalidad?</p>
                        <div className='mt-4'>
                            <button
                                onClick={borrarFuncionalidad}
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

export default FuncionalidadesList;
