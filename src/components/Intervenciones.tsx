import React from 'react';
import Link from 'next/link';
import { IntervencionModel } from '@/types';

interface IntervencionesListProps {
    intervenciones: IntervencionModel[];
}

const IntervencionesList: React.FC<IntervencionesListProps> = ({ intervenciones = [] }) => {
    if (!intervenciones.length) {
        return <p className="text-center">No hay intervenciones disponibles</p>;
    }

    return (
        <div className="flex flex-col overflow-x-auto">
            <div className="sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b font-normal dark:border-neutral-500">
                            <tr className='bg-gray-200 text-center dark:bg-meta-4'>
                                <th className='px-8 py-3 text-left'>Tipo de Intervención</th>
                                <th className='px-8 py-3 text-left'>Fecha de Intervención</th>
                                <th className='px-8 py-3 text-left'>Motivo</th>
                                <th className='px-8 py-3 text-left'>Equipo ID interno</th>
                                <th className='px-8 py-3 text-left'>Comentario</th>
                                <th className='px-8 py-3 text-left'>Acciones</th>
                            </tr>
                            </thead>
                            <tbody className='bg-white items-center text-xs'>
                            {intervenciones.map((intervencion) => (
                                <tr key={intervencion.id}>
                                    <td className='px-8 py-3'>{intervencion.idTipo.nombreTipo}</td>
                                    <td className='px-8 py-3'>{intervencion.fechaHora}</td>
                                    <td className='px-8 py-3'>{intervencion.motivo}</td>
                                    <td className='px-8 py-3'>{intervencion.idEquipo.idInterno}</td>
                                    <td className='px-8 py-3'>{intervencion.comentarios || 'N/A'}</td>
                                    <td className='px-8 py-3'>
                                        <div className="inline-flex">
                                            {/* Botón para Editar */}
                                            <span className='bg-yellow-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer'>
                                                <Link href={`/intervenciones/edit/${intervencion.id}`}>
                                                    Editar
                                                </Link>
                                            </span>
                                            {/* Botón para Ver Detalles */}
                                            <span className='bg-blue-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer'>
                                                <Link href={`/intervenciones/read/${intervencion.id}`}>
                                                    Detalles
                                                </Link>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntervencionesList;
