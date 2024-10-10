"use client";
import { useEffect, useState } from 'react';
import ModelosList from '@/components/Modelos';
import { signIn, useSession } from 'next-auth/react';
import { ModeloModel, ReferrerEnum } from '@/types/index';
import DynamicTable from '@/components/DynamicTable';

const ModelosRead = () => {
    const { data: session } = useSession();
    const token = session?.accessToken ?? ''; // Obtener el token de la sesión
  
    // Endpoint base para obtener datos generales
    const baseEndpoint = process.env.NEXT_PUBLIC_API_URL + "/modelo/listar";
    const deleteEndpoint = process.env.NEXT_PUBLIC_API_URL + "/modelo/";
    // Columnas de la tabla
    const columns = [
      { key: 'nombre', label: 'Nombre', filterable: true },
      { key: 'marca', data: 'idMarca.nombre', label: 'Marca', filterable: false },
      {
        key: 'estado',
        label: 'Estado',
        filterable: true,
        isDropdown: true,
        dropdownOptionsEndpoint: null, // No necesitamos endpoint
        dropdownOptions: [
          { id: 'ACTIVO', nombre: 'Activo' },
          { id: 'INACTIVO', nombre: 'Inactivo' }
        ], // Opciones fijas para el estado
      },
    ];
  
    const actionRoutes = {
      view: (id: number) => `/modelos/read/${id}`,
      edit: (id: number) => `/modelos/edit/${id}`,
      delete: (id: number) => `/modelos/delete/${id}`,
    };
  
    const actionsVisibility = {
      showView: true,
      showEdit: true,
      showDelete: true,
    };
  
    useEffect(() => {
      if (!session) {
        signIn(); // Si no hay sesión, iniciar sesión
      }
    }, [session]);
  
    if (!session) return null; // Si no hay sesión, no renderizamos nada

    return (
        <div>
      <h1>Reporte de Equipos Inactivos</h1>
      <DynamicTable
        baseEndpoint={baseEndpoint}
        columns={columns}
        token={token}
        showActions={true}
        actionRoutes={actionRoutes}
        actionsVisibility={actionsVisibility}
        useDeleteModal={true}
        deleteEndpoint={deleteEndpoint}
      />
    </div>
    );
}

export default ModelosRead;
