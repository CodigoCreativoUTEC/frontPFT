'use client'; // Asegúrate de incluir esto
import DynamicTable from '../DynamicTable';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { isDate } from 'date-fns';

const EquiposRead = () => {
    const { data: session } = useSession();
    const token = session?.accessToken ?? ''; // Obtener el token de la sesión

    // Estado inicial de los filtros
    const [filterValues, setFilterValues] = useState({
        estado: 'ACTIVO',  // Filtro fijo de estado ACTIVO
        paisOrigen: '',    // Filtro opcional del país de origen
    });

    // Endpoint base para obtener datos generales
    const baseEndpoint = process.env.NEXT_PUBLIC_API_URL + "/equipos/filtrar";

    // Filtros con sus respectivos valores
    const filters = {
        estado: { value: filterValues.estado, endpoint: baseEndpoint }, // Siempre "ACTIVO"
        paisOrigen: { value: filterValues.paisOrigen, endpoint: baseEndpoint }
    };

    // Columnas de la tabla
    const columns = [
        { key: 'nombre', label: 'Nombre', filterable: true },
        { key: 'identificacionInterna', data: 'idInterno', label: 'ID Interno', filterable: true },
        { key: 'numeroSerie', data: 'nroSerie', label: 'N° Serie', filterable: true },
        { key: 'modelo', data: 'idModelo.nombre', label: 'Modelo', filterable: true },
        { key: 'marca', data: 'idModelo.idMarca.nombre', label: 'Marca', filterable: true },
        {
            key: 'paisOrigen', 
            data: 'idPais.nombre',
            label: 'País',
            filterable: true,
            isDropdown: true,
            dropdownOptionsEndpoint: process.env.NEXT_PUBLIC_API_URL + "/paises/listar"
        },
        { key: 'fechaAdquisicion', label: 'Fecha de Adquisición', filterable: true, isDate: true },
        { key: 'garantia', label: 'Garantía', filterable: false },
        { key: 'proveedor', data: 'idProveedor.nombre', label: 'Proveedor', filterable: true },
        { key: 'ubicacion', data: 'idUbicacion.nombre', label: 'Ubicación', filterable: true },
        { key: 'tipo', data: 'idTipo.nombreTipo', label: 'Tipo de Equipo', filterable: true },

        { key: 'estado', label: 'Estado', filterable: false } // Estado no editable, siempre "ACTIVO"
    ];

    const actionRoutes = {
        view: (id) => `/equipos/read/${id}`,
        edit: (id) => `/equipos/edit/${id}`,
        delete: (id) => `/equipos/delete/${id}`
    };

    useEffect(() => {
        // Si deseas que el filtro de estado "ACTIVO" esté siempre aplicado
        setFilterValues(prevValues => ({ ...prevValues, estado: 'ACTIVO' }));
    }, []);

    return (
        <div>
            <h1>Reporte de Equipos Activos</h1>
            <DynamicTable 
            baseEndpoint={baseEndpoint} 
            filters={filters} 
            columns={columns} 
            token={token} 
            showActions={true} 
            actionRoutes={actionRoutes}
            useDeleteModal={false}
            deleteEndpoint= {process.env.NEXT_PUBLIC_API_URL + "/equipos/eliminar"}
            />
        </div>
    );
};

export default EquiposRead;
