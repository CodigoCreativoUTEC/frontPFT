"use client";
import { useEffect, useState } from 'react';
import IntervencionesList from '@/components/Intervenciones';
import { signIn, useSession } from 'next-auth/react';
import { IntervencionModel, ReferrerEnum } from '@/types';

const IntervencionesRead = () => {

    // Datos harcodeados
    const initialIntervenciones = [
        { id: 1, nombre: "Intervención A", estado: ReferrerEnum.ACTIVO },
        { id: 2, nombre: "Intervención B", estado: ReferrerEnum.INACTIVO },
        { id: 3, nombre: "Intervención C", estado: ReferrerEnum.ACTIVO }
    ];

    // @ts-ignore
    const [intervenciones, setIntervenciones] = useState<IntervencionModel[]>(initialIntervenciones);
    // @ts-ignore
    const [filteredIntervenciones, setFilteredIntervenciones] = useState<IntervencionModel[]>(initialIntervenciones);
    const [nombreFilter, setNombreFilter] = useState<string>('');
    const [estadoFilter, setEstadoFilter] = useState<string>('');

    useEffect(() => {
        // No real fetch call, we use static data
        setFilteredIntervenciones(intervenciones);
    }, []);

    /*const { data: session, status } = useSession();
    const [intervenciones, setIntervenciones] = useState<IntervencionModel[]>([]);
    const [filteredIntervenciones, setFilteredIntervenciones] = useState<IntervencionModel[]>([]);
    const [nombreFilter, setNombreFilter] = useState<string>('');
    const [estadoFilter, setEstadoFilter] = useState<string>('');

    const fetcher = async () => {
        const res = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/intervenciones/ListarTodasLasIntervenciones", {
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + (session?.user?.accessToken || ''),
            },
        });
        const result: IntervencionModel[] = await res.json();
        setIntervenciones(result);
        setFilteredIntervenciones(result);
    };

    useEffect(() => {
        fetcher();
    }, []);*/

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombreFilter(e.target.value);
        filterIntervenciones(e.target.value, estadoFilter);
    };

    const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEstadoFilter(e.target.value);
        filterIntervenciones(nombreFilter, e.target.value);
    };

    const filterIntervenciones = (nombre: string, estado: string) => {
        let filtered = intervenciones.filter(intervencion =>
            (!nombre || intervencion.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
            (!estado || intervencion.estado === estado)
        );
        setFilteredIntervenciones(filtered);
    };

    const handleClearFilters = () => {
        setNombreFilter('');
        setEstadoFilter('');
        setFilteredIntervenciones(intervenciones);
    };

    // if (!session) { signIn(); return null; }

    return (
        <div className='rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
            <div className='mb-4 flex flex-wrap gap-4'>
                {/* Nombre Input */}
                <input
                    type="text"
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Nombre de la Intervención"
                    value={nombreFilter}
                    onChange={handleNombreChange}
                />
                {/* Estado Select */}
                <select
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={estadoFilter}
                    onChange={handleEstadoChange}
                >
                    <option value="">Selecciona un Estado</option>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                </select>
                {/* Botón de Limpiar Filtros */}
                <button
                    onClick={handleClearFilters}
                    className="bg-violet-800 text-white px-3 py-1 rounded"
                >
                    Limpiar Filtros
                </button>
            </div>
            <div className="flex flex-col overflow-x-auto">
                <div className="sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="border-b font-normal dark:border-neutral-500">
                                <tr className='bg-gray-200 text-center dark:bg-meta-4'>
                                    <th className="px-8 py-3 text-left">ID</th>
                                    <th className='px-8 py-3 text-left'>Nombre</th>
                                    <th className='px-8 py-3 text-left'>Estado</th>
                                    <th className='px-8 py-3 text-left'>Acciones</th>
                                </tr>
                                </thead>
                                <tbody className='bg-white items-center text-xs'>
                                {filteredIntervenciones.map((intervencion) => (
                                    <IntervencionesList
                                        key={intervencion.id}
                                        {...intervencion}
                                        //fetcher={fetcher}
                                        fetcher={() => {}}
                                    />
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IntervencionesRead;
