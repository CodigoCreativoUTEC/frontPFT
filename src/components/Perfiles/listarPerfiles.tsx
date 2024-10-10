'use client';

import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import DynamicTable from '@/components/DynamicTable';

const PerfilesRead = () => {
  const { data: session } = useSession();
  const token = session?.accessToken ?? ''; // Obtener el token de la sesión

  // Endpoint base para obtener perfiles
  const baseEndpoint = process.env.NEXT_PUBLIC_API_URL + '/perfiles/listar';
  const deleteEndpoint = process.env.NEXT_PUBLIC_API_URL + '/perfiles/';

  // Columnas de la tabla
  const columns = [
    { key: 'nombrePerfil', label: 'Nombre del Perfil', filterable: true },
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
    view: (id: number) => `/perfiles/read/${id}`,
    edit: (id: number) => `/perfiles/edit/${id}`,
    delete: (id: number) => `/perfiles/delete/${id}`,
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
      <h1>Gestión de Perfiles</h1>
      <DynamicTable
        baseEndpoint={baseEndpoint}
        columns={columns}
        token={token}
        actionRoutes={actionRoutes}
        actionsVisibility={actionsVisibility}
        useDeleteModal={true} // Mostrar modal de confirmación al borrar
        deleteEndpoint={deleteEndpoint} // Endpoint para borrar perfiles
      />
    </div>
  );
};

export default PerfilesRead;
