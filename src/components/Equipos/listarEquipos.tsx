'use client'; // Asegúrate de incluir esto
import DynamicTable from '../DynamicTable';
import { useState, useEffect } from 'react';
import { getToken } from 'next-auth/jwt';

const EquiposRead = () => {
  const token = getToken(); // Obtener el token de la sesión

  // Estado inicial de los filtros
  const [filterValues, setFilterValues] = useState({
    estado: 'ACTIVO',  // Por defecto mostrar solo los equipos en estado ACTIVO
  });

  // Endpoint base para obtener datos generales
  const baseEndpoint = process.env.NEXT_PUBLIC_API_URL+"/equipos/filtrar";

  // Filtros con sus respectivos endpoints
  const filters = {
    estado: { value: filterValues.estado, endpoint: baseEndpoint },
    paisOrigen: { value: '', endpoint: baseEndpoint }
  };

  // Columnas de la tabla
    const columns = [
    { key: 'nombre', label: 'Nombre', filterable: true },
    { key: 'idInterno', label: 'ID Interno', filterable: true },
    { key: 'nroSerie', label: 'N° Serie', filterable: true },
    { key: 'modelo', data: 'idModelo.nombre', label: 'Modelo', filterable: true },
    { key: 'marca', data: 'idModelo.idMarca.nombre', label: 'Marca', filterable: true },
    {
      key: 'paisOrigen', // Clave anidada
      data : 'idPais.nombre',
      label: 'País',
      filterable: true,
      isDropdown: true,
      dropdownOptionsEndpoint: process.env.NEXT_PUBLIC_API_URL+"/api/paises/listar"
    },
    { key: 'fechaAdquisicion', label: 'Fecha de Adquisición', filterable: true },
    { key: 'garantia', label: 'Garantía', filterable: false },
    { key: 'proveedor', data: 'idProveedor.nombre', label: 'Proveedor', filterable: false },
    { key: 'ubicacion', data: 'idUbicacion.nombre', label: 'Ubicación', filterable: true },
    { key: 'tipo', data: 'idTipo.nombreTipo', label: 'Tipo de Equipo', filterable: true },

    { key: 'estado', label: 'Estado', filterable: true }
  ];

  useEffect(() => {
    // Si deseas que el filtro de estado "ACTIVO" esté siempre aplicado, puedes inicializar el estado de los filtros aquí
    setFilterValues(prevValues => ({ ...prevValues, estado: 'ACTIVO' }));
  }, []);

  return (
    <div>
      <h1>Reporte de Equipos</h1>
      <DynamicTable baseEndpoint={baseEndpoint} filters={filters} columns={columns} token={token} />
    </div>
  );
};

export default EquiposRead;
