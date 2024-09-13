import React, { useState } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import {MarcaModel} from "@/types";

interface MarcasListProps extends MarcaModel {
    fetcher: () => void;
}

const MarcasList: React.FC<MarcasListProps> = (params) => {
    const { data: session, status } = useSession();
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [marcaIdToDelete, setMarcaIdToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number | null) => {
        setMarcaIdToDelete(id);
        setShowConfirmModal(true);
    };

    const borrarMarca = async () => {
        if (marcaIdToDelete === null) return;

        try {
            const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/marcas/eliminar?id=${marcaIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + (session?.user?.accessToken || ''),
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al eliminar la marca');
            }

            if (!session) { signIn(); return null; }

            params.fetcher();  // Refresh the list after deletion
        } catch (error) {
            console.error('Error al eliminar marca:', error);
        } finally {
            setShowConfirmModal(false);
            setMarcaIdToDelete(null);
        }
    };

    return (
        <>
            <tr className="border-b text-black bold dark:border-neutral-500 odd:bg-blue-200 dark:odd:bg-slate-700 dark:even:bg-slate-500 dark:odd:text-bodydark2">
                <td className='px-8 py-3'>{params.id}</td>
                <td className='px-8 py-3'>{params.nombre}</td>
                <td className='px-8 py-3'>{params.estado}</td>
                <td className='px-8 py-3'>
                    <div className="inline-flex">
                        <span
                            className='bg-rose-500 p-1 inline-block ml-1 text-white text-xs rounded cursor-pointer'
                            onClick={() => handleDeleteClick(params.id)}>
                            Eliminar
                        </span>
                        <span className='bg-yellow-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer'>
                            <Link href={`/marcas/edit/${params.id}`}>
                                Editar
                            </Link>
                        </span>
                        <span className='bg-blue-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer'>
                            <Link href={`/marcas/read/${params.id}`}>
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
                        <p>¿Estás seguro de que deseas eliminar esta marca?</p>
                        <div className='mt-4'>
                            <button
                                onClick={borrarMarca}
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

export default MarcasList;