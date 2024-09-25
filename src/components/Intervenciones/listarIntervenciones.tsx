"use client";
import { useState } from 'react';
import IntervencionesList from '@/components/Intervenciones';
import { IntervencionModel } from '@/types';
import * as Papa from 'papaparse'; // Para exportar CSV
import * as XLSX from 'xlsx'; // Para exportar Excel
import { saveAs } from 'file-saver'; // Para descargar el archivo

const IntervencionesRead = () => {
    // Datos hardcodeados de ejemplo
    const initialIntervenciones: IntervencionModel[] = [
        { id: 1, tipo: "Prevención", fechaIntervencion: "2023-09-01T10:00", motivo: "Mantenimiento preventivo", equipoId: "EQ001", observaciones: "N/A" },
        { id: 2, tipo: "Falla", fechaIntervencion: "2023-09-10T15:30", motivo: "Reparación por falla", equipoId: "EQ002", observaciones: "Se cambió una pieza" },
        { id: 3, tipo: "Resolución", fechaIntervencion: "2023-10-01T08:45", motivo: "Revisión final", equipoId: "EQ003", observaciones: "Todo en orden" }
    ];

    const [filteredIntervenciones, setFilteredIntervenciones] = useState<IntervencionModel[]>(initialIntervenciones);
    const [fechaDesde, setFechaDesde] = useState<string>(''); // Filtro de Fecha Desde
    const [fechaHasta, setFechaHasta] = useState<string>(''); // Filtro de Fecha Hasta
    const [tipoFilter, setTipoFilter] = useState<string>(''); // Filtro de Tipo de Intervención
    const [equipoIdFilter, setEquipoIdFilter] = useState<string>(''); // Filtro de Identificación del Equipo

    const filterIntervenciones = () => {
        let filtered = initialIntervenciones.filter(intervencion => {
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

    const handleClearFilters = () => {
        setFechaDesde('');
        setFechaHasta('');
        setTipoFilter('');
        setEquipoIdFilter('');
        setFilteredIntervenciones(initialIntervenciones); // Volver a mostrar todos los datos
    };

    // Exportar CSV
    const exportToCSV = () => {
        const csv = Papa.unparse(filteredIntervenciones);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "intervenciones.csv");
    };

    // Exportar Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredIntervenciones);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "intervenciones.xlsx");
    };

    return (
        <div className='rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
            <div className='mb-4 flex flex-wrap gap-4'>
                {/* Filtro por Fecha Desde */}
                Fechas Desde y Hasta:
                <input
                    type="date"
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Fecha Desde"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                />
                {/* Filtro por Fecha Hasta */}
                <input
                    type="date"
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Fecha Hasta"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                />
                {/* Filtro por Tipo de Intervención */}
                <select
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={tipoFilter}
                    onChange={(e) => setTipoFilter(e.target.value)}
                >
                    <option value="">Selecciona Tipo de Intervención</option>
                    <option value="Prevención">Prevención</option>
                    <option value="Falla">Falla</option>
                    <option value="Resolución">Resolución</option>
                </select>
                {/* Filtro por Identificación del Equipo */}
                <input
                    type="text"
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Identificación del Equipo"
                    value={equipoIdFilter}
                    onChange={(e) => setEquipoIdFilter(e.target.value)}
                />
                {/* Botón de Limpiar Filtros */}
                <button
                    onClick={handleClearFilters}
                    className="bg-violet-800 text-white px-3 py-1 rounded"
                >
                    Limpiar Filtros
                </button>
                {/* Botón para Aplicar Filtros */}
                <button
                    onClick={filterIntervenciones}
                    className="bg-blue-800 text-white px-3 py-1 rounded"
                >
                    Aplicar Filtros
                </button>
            </div>

            {/* Botones para exportar */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={exportToCSV}
                    className="bg-green-600 text-white px-3 py-2 rounded"
                >
                    Descargar CSV
                </button>
                <button
                    onClick={exportToExcel}
                    className="bg-blue-600 text-white px-3 py-2 rounded"
                >
                    Descargar Excel
                </button>
            </div>

            {/* Mostrar la lista de intervenciones filtradas */}
            <IntervencionesList intervenciones={filteredIntervenciones} /> {/* Aquí usa IntervencionesList */}
        </div>
    );
};

export default IntervencionesRead;




