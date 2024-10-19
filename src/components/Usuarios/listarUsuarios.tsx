'use client';
import DynamicTable from '../DynamicTable';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const UsuariosRead = () => {
  const session = useSession();
  const token = session.data?.accessToken || ''; // Obtener el token de la sesión

  // Endpoint base para obtener datos generales
  const baseEndpoint = process.env.NEXT_PUBLIC_API_URL + "/usuarios/filtrar";
  const deleteEndpoint = process.env.NEXT_PUBLIC_API_URL + "/usuarios/inactivar?id=";

  // Estado inicial de los filtros
  const [filterValues, setFilterValues] = useState({
    estado: 'ACTIVO',  // Cargar usuarios activos por defecto
  });

  // Filtros con sus respectivos endpoints
  const filters = {
    estado: { value: filterValues.estado, endpoint: baseEndpoint },
  };

  const actionsVisibility = {
    showView: true,
    showEdit: true,
    showDelete: true,
  };

  const actionRoutes = {
    view: (id: number) => `/usuarios/read/${id}`,
    edit: (id: number) => `/usuarios/edit/${id}`,
    delete: (id: number) => `/usuarios/delete/${id}`,
  };

  // Columnas de la tabla
  const columns = [
    { key: 'nombre', label: 'Nombre', filterable: true },
    { key: 'apellido', label: 'Apellido', filterable: true },
    { key: 'ci', label: 'CI', data: 'cedula', filterable: false },
    { key: 'telefono', data: 'usuariosTelefonos.numero', label: 'Teléfono', filterable: false },
    { key: 'fechaNacimiento', label: 'Fecha de Nacimiento', filterable: false, isDate: true },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'nombreUsuario', label: 'Nombre de Usuario', filterable: true },
    { 
      key: 'perfil', 
      data: 'idPerfil.nombrePerfil', 
      dropdownLabelKey: 'nombrePerfil',
      label: 'Perfil', 
      filterable: true, 
      isDropdown: true, 
      dropdownOptionsEndpoint: process.env.NEXT_PUBLIC_API_URL + "/perfiles/listar" 
    },
    { 
      key: 'estado', 
      label: 'Estado', 
      filterable: true, 
      isDropdown: true, 
      dropdownOptions: [
        { id: 'ACTIVO', nombre: 'Activos' },
        { id: 'INACTIVO', nombre: 'Inactivos' },
        { id: 'SIN_VALIDAR', nombre: 'Sin Validar' },
      ],
    },
  ];

  // Lógica para manejar el cambio de filtros, incluyendo el estado dinámico
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  // Al cargar la página, asegurarse de que el filtro de "estado" sea "ACTIVO"
  useEffect(() => {
    setFilterValues(prev => ({ ...prev, estado: 'ACTIVO' }));
  }, []);

  return (
    <div>
      <h1>Reporte de Usuarios</h1>
      <DynamicTable 
        baseEndpoint={baseEndpoint} 
        filters={filters} 
        columns={columns} 
        token={token} 
        deleteEndpoint={deleteEndpoint} 
        useDeleteModal={true} 
        actionsVisibility={actionsVisibility} 
        actionRoutes={actionRoutes}
        onFilterChange={handleFilterChange} // Para cambiar los filtros dinámicamente
      />
    </div>
  );
};

export default UsuariosRead;
