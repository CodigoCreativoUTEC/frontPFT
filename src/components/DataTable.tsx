"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Column<T> {
    key: string; // Permite keys anidadas como 'pais.nombre'
    label: string;
}

interface Filter {
    key: string;
    label: string;
    type: 'text' | 'select';
    optionsUrl?: string; // Solo para tipo 'select'
}

interface DataTableProps<T> {
    url: string; // Endpoint para obtener los datos
    columns: Column<T>[]; // Definición de columnas
    filters?: Filter[]; // Definición de filtros
    actionHandlers: {
        onDelete: (id: string | number) => Promise<void>;
        onEdit: (id: string | number) => void;
        onView: (id: string | number) => void;
    };
}

const DataTable = <T,>({ url, columns, filters = [], actionHandlers }: DataTableProps<T>) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Estado para filtros
    const [filterValues, setFilterValues] = useState<{ [key: string]: string }>({});
    const [selectOptions, setSelectOptions] = useState<{ [key: string]: { value: string | number, label: string }[] }>({});

    // Obtener opciones para filtros tipo 'select'
    useEffect(() => {
        const fetchSelectOptions = async () => {
            const newSelectOptions: { [key: string]: { value: string | number, label: string }[] } = {};
            await Promise.all(filters.map(async (filter) => {
                if (filter.type === 'select' && filter.optionsUrl) {
                    try {
                        const res = await fetch(filter.optionsUrl, {
                            headers: {
                                'Authorization': `Bearer ${session?.accessToken || ''}`,
                            },
                        });
                        if (!res.ok) {
                            throw new Error(`Error al obtener opciones para ${filter.label}`);
                        }
                        const result = await res.json();
                        // Asumiendo que el resultado es un array de objetos con 'id' y 'nombre'
                        newSelectOptions[filter.key] = result.map((item: any) => ({
                            value: item.id,
                            label: item.nombre,
                        }));
                    } catch (err: any) {
                        console.error(err);
                        setError(err.message);
                    }
                }
            }));
            setSelectOptions(newSelectOptions);
        };

        if (filters.length > 0 && session) {
            fetchSelectOptions();
        }
    }, [filters, session]);

    // Función para obtener valores anidados
    const getNestedValue = (item: any, key: string) => {
        return key.split('.').reduce((value, keyPart) => value && value[keyPart], item);
    };

    // Función para construir query params
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        Object.keys(filterValues).forEach(key => {
            if (filterValues[key]) {
                params.append(key, filterValues[key]);
            }
        });
        return params.toString();
    };

    // Función para obtener datos
    const fetchData = useCallback(async () => {
        if (!session) {
            signIn();
            return;
        }
    
        setLoading(true);
        setError(null);
    
        try {
            const queryParams = buildQueryParams();
            // Si hay filtros aplicados, usa el endpoint 'buscar', de lo contrario usa 'listarTodos'
            const fetchUrl = queryParams ? `http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/proveedores/buscar?${queryParams}` : url;
    
            const res = await fetch(fetchUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.accessToken}`,
                },
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al obtener los datos');
            }
    
            const result = await res.json();
            setData(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [url, filterValues, session]);
    

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [fetchData, session]);

    // Manejo de cambios en filtros
    const handleFilterChange = (key: string, value: string) => {
        setFilterValues(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    // Manejo de búsqueda
    const handleSearch = () => {
        fetchData();
    };

    // Manejo de limpieza de filtros
    const handleClearFilters = () => {
        setFilterValues({});
    };

    // Manejo de eliminación con confirmación
    const handleDelete = async (id: string | number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) return;
        await actionHandlers.onDelete(id);
        fetchData();
    };

    if (status === 'loading') return <p>Cargando sesión...</p>;

    if (!session) return null;

    return (
        <div className="p-4 bg-white rounded shadow">
            {/* Mensaje de Error */}
            {error && (
                <div className="bg-red-500 text-white p-4 rounded mb-4 flex justify-between items-center">
                    <span><strong>Error:</strong> {error}</span>
                    <button onClick={() => setError(null)} className="text-white font-bold">x</button>
                </div>
            )}

            {/* Filtros */}
            {filters.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-4 items-end">
                    {filters.map(filter => (
                        <div key={filter.key} className="flex flex-col">
                            <label className="mb-1 font-semibold">{filter.label}</label>
                            {filter.type === 'text' ? (
                                <input
                                    type="text"
                                    value={filterValues[filter.key] || ''}
                                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                    className="border p-2 rounded w-48"
                                />
                            ) : filter.type === 'select' ? (
                                <select
                                    value={filterValues[filter.key] || ''}
                                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                    className="border p-2 rounded w-48"
                                >
                                    <option value="">Selecciona un {filter.label}</option>
                                    {selectOptions[filter.key]?.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            ) : null}
                        </div>
                    ))}
                    <div className="flex flex-col">
                        <label className="mb-1">&nbsp;</label>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSearch}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Buscar
                            </button>
                            <button
                                onClick={handleClearFilters}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla */}
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead>
                            <tr className="bg-gray-200">
                                {columns.map(col => (
                                    <th key={col.key} className="px-4 py-2 border">{col.label}</th>
                                ))}
                                <th className="px-4 py-2 border">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-4 py-2 text-center">No hay proveedores para mostrar.</td>
                                </tr>
                            ) : (
                                data.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-100">
                                        {columns.map(col => (
                                            <td key={col.key} className="px-4 py-2 border">
                                                {getNestedValue(item, col.key)}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2 border flex space-x-2">
                                            <button
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                                onClick={() => actionHandlers.onView(item.id)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                                                onClick={() => actionHandlers.onEdit(item.id)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Borrar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DataTable;
