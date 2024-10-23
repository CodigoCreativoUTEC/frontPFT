'use client';

import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import DynamicTable from '@/components/DynamicTable';

const ProveedoresRead = () => {
  const { data: session } = useSession();
  const token = session?.accessToken ?? ''; // Obtener el token de la sesión

  // Endpoint base para obtener proveedores
  const baseEndpoint = process.env.NEXT_PUBLIC_API_URL + '/proveedores/listar';
  const deleteEndpoint = process.env.NEXT_PUBLIC_API_URL + '/proveedores/inactivar';
  
  // Columnas de la tabla
  const columns = [
    { key: 'nombre', label: 'Nombre del Proveedor', filterable: true },
    { key: 'pais', data: 'pais.nombre', label: 'País', filterable: false },
    {
      key: 'estado',
      label: 'Estado',
      filterable: true,
      isDropdown: true,
      dropdownOptions: [
        { id: 'ACTIVO', nombre: 'ACTIVO' },
        { id: 'INACTIVO', nombre: 'INACTIVO' },
      ], // Opciones fijas para el filtro de estado
    },
  ];

  // Rutas de acciones
  const actionRoutes = {
    view: (id: number) => `/proveedores/read/${id}`,
    edit: (id: number) => `/proveedores/edit/${id}`,
    delete: (id: number) => `/proveedores/delete/${id}`,
  };

  // Control de visibilidad de acciones
  const actionsVisibility = {
    showView: true,
    showEdit: true,
    showDelete: true,
  };

  if (!session) {
    signIn();
    return null;
  }

  return (
    <div>
      <h1>Gestión de Proveedores</h1>
      <DynamicTable
        baseEndpoint={baseEndpoint}
        columns={columns}
        token={token}
        actionRoutes={actionRoutes}
        actionsVisibility={actionsVisibility}
        useDeleteModal={true} // Mostrar modal de confirmación al borrar
        deleteEndpoint={deleteEndpoint} // Endpoint para borrar proveedores
      />
    </div>
  );
};

export default ProveedoresRead;
