"use client";
import { useState, useEffect } from 'react';
import IntervencionesList from '@/components/Intervenciones';
import { IntervencionModel } from '@/types';
import * as Papa from 'papaparse'; // Para exportar CSV

import { saveAs } from 'file-saver'; // Para descargar el archivo
import { useSession } from 'next-auth/react';

const IntervencionesRead = () => {
    const [intervenciones, setIntervenciones] = useState<IntervencionModel[]>([]);
    const [filteredIntervenciones, setFilteredIntervenciones] = useState<IntervencionModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Para el estado de carga
    const [error, setError] = useState<string | null>(null); // Para manejar errores
    const [fechaDesde, setFechaDesde] = useState<string>(''); 
    const [fechaHasta, setFechaHasta] = useState<string>(''); 
    const [tipoFilter, setTipoFilter] = useState<string>(''); 
    const [equipoIdFilter, setEquipoIdFilter] = useState<string>(''); 
    const { data: session, status } = useSession();
    

    // useEffect para llamar a la API cuando se monta el componente
    useEffect(() => {
        const fetchIntervenciones = async () => {
            setLoading(true); // Indica que la carga está en progreso
            setError(null); // Resetea el error antes de la llamada

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/intervencion/listar`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + (session?.accessToken ?? ""), // Asegúrate de tener el token de sesión
                    },
                });

                if (!res.ok) {
                    throw new Error("Error en la solicitud: " + res.statusText);
                }

                const data: IntervencionModel[] = await res.json();
                setIntervenciones(data);
                setFilteredIntervenciones(data); // Inicializa los datos filtrados con todos los datos
            } catch (err) {
                setError(err.message); // Captura el error si ocurre
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchIntervenciones();
    }, [session]);

    // Función para filtrar las intervenciones
    const filterIntervenciones = () => {
        let filtered = intervenciones.filter(intervencion => {
            const intervencionFecha = new Date(intervencion.fechaIntervencion);
            const desdeFecha = fechaDesde ? new Date(fechaDesde) : null;
            const hastaFecha = fechaHasta ? new Date(fechaHasta) : null;

            return (
                (!fechaDesde || intervencionFecha >= desdeFecha!) &&
                (!fechaHasta || intervencionFecha <= hastaFecha!) &&
                (!tipoFilter || intervencion.tipo === tipoFilter) &&
                (!equipoIdFilter || intervencion.equipoId.includes(equipoIdFilter))
            );
        });

        setFilteredIntervenciones(filtered);
    };

    // Limpiar filtros
    const handleClearFilters = () => {
        setFechaDesde('');
        setFechaHasta('');
        setTipoFilter('');
        setEquipoIdFilter('');
        setFilteredIntervenciones(intervenciones); // Vuelve a mostrar todos los datos
    };

    // Exportar a CSV
    const exportToCSV = () => {
        const csv = Papa.unparse(filteredIntervenciones);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "intervenciones.csv");
    };

    // Exportar a Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredIntervenciones);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "intervenciones.xlsx");
    };

    // Renderiza la lista de intervenciones o muestra un mensaje de carga
    return (
        <div className='rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
            {loading ? (
                <p>Cargando intervenciones...</p>
            ) : error ? (
                <p>Error al cargar las intervenciones: {error}</p>
            ) : (
                <>
                    <div className='mb-4 flex flex-wrap gap-4'>
                        {/* Filtros */}
                        Fechas Desde y Hasta:
                        <input
                            type="date"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                        />
                        <input
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                        />
                        <select
                            value={tipoFilter}
                            onChange={(e) => setTipoFilter(e.target.value)}
                        >
                            <option value="">Selecciona Tipo de Intervención</option>
                            <option value="Prevención">Prevención</option>
                            <option value="Falla">Falla</option>
                            <option value="Resolución">Resolución</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Identificación del Equipo"
                            value={equipoIdFilter}
                            onChange={(e) => setEquipoIdFilter(e.target.value)}
                        />
                        <button onClick={handleClearFilters}>Limpiar Filtros</button>
                        <button onClick={filterIntervenciones}>Aplicar Filtros</button>
                    </div>

                    {/* Exportar botones */}
                    <div className="flex gap-4 mb-4">
                        <button onClick={exportToCSV}>Descargar CSV</button>
                        <button onClick={exportToExcel}>Descargar Excel</button>
                    </div>

                    {/* Mostrar la lista de intervenciones */}
                    <IntervencionesList intervenciones={filteredIntervenciones} />
                </>
            )}
        </div>
    );
};

export default IntervencionesRead;
