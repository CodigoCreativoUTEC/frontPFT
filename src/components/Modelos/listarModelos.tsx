"use client";
import { useEffect, useState } from 'react';
import ModelosList from '@/components/Modelos';
import { signIn, useSession } from 'next-auth/react';
import { ModeloModel, ReferrerEnum } from '@/types';

const ModelosRead = () => {

    // Datos harcodeados
    const initialModelos = [
        { id: 1, nombre: "Modelo A", estado: ReferrerEnum.ACTIVO },
        { id: 2, nombre: "Modelo B", estado: ReferrerEnum.INACTIVO },
        { id: 3, nombre: "Modelo C", estado: ReferrerEnum.ACTIVO }
    ];

    const [modelos, setModelos] = useState<ModeloModel[]>(initialModelos);
    const [filteredModelos, setFilteredModelos] = useState<ModeloModel[]>(initialModelos);
    const [nombreFilter, setNombreFilter] = useState<string>('');
    const [estadoFilter, setEstadoFilter] = useState<string>('');

    useEffect(() => {
        // No real fetch call, we use static data
        setFilteredModelos(modelos);
    }, []);

    /*const { data: session, status } = useSession();
    const [modelos, setModelos] = useState<ModeloModel[]>([]);
    const [filteredModelos, setFilteredModelos] = useState<ModeloModel[]>([]);
    const [nombreFilter, setNombreFilter] = useState<string>('');
    const [estadoFilter, setEstadoFilter] = useState<string>('');

    const fetcher = async () => {
        const res = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/modelos/ListarTodosLosModelos", {
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + (session?.user?.accessToken || ''),
            },
        });
        const result: ModeloModel[] = await res.json();
        setModelos(result);
        setFilteredModelos(result);
    };

    useEffect(() => {
        fetcher();
    }, []);*/


    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombreFilter(e.target.value);
        filterModelos(e.target.value, estadoFilter);
    };

    const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEstadoFilter(e.target.value);
        filterModelos(nombreFilter, e.target.value);
    };

    const filterModelos = (nombre: string, estado: string) => {
        let filtered = modelos.filter(modelo =>
            (!nombre || modelo.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
            (!estado || modelo.estado === estado)
        );
        setFilteredModelos(filtered);
    };

    const handleClearFilters = () => {
        setNombreFilter('');
        setEstadoFilter('');
        setFilteredModelos(modelos);
    };

    // if (!session) { signIn(); return null; }

    return (
        <div className='rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
            <div className='mb-4 flex flex-wrap gap-4'>
                {/* Nombre Input */}
                <input
                    type="text"
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Nombre del Modelo"
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
                                {filteredModelos.map((modelo) => (
                                    <ModelosList
                                        key={modelo.id}
                                        {...modelo}
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

export default ModelosRead;
