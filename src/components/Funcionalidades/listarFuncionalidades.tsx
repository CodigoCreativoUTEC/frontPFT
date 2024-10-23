"use client";
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { FuncionalidadModel } from '@/types';
import DynamicTable from '@/components/DynamicTable';
import { id } from 'date-fns/locale';

const FuncionalidadesRead = () => {

    const { data: session } = useSession();
    const token = session?.accessToken ?? ''; // Obtener el token de la sesión

    // Endpoint base para obtener datos generales
    const baseEndpoint = process.env.NEXT_PUBLIC_API_URL + "/funcionalidades/listar";
    const deleteEndpoint = process.env.NEXT_PUBLIC_API_URL + "/funcionalidades/inactivar";

    // Columnas de la tabla
    const columns = [
        { key: 'nombreFuncionalidad', label: 'Funcionalidad', filterable: false },
        { key: 'perfiles', data:'perfiles.nombrePerfil', label: 'Perfiles', filterable: false },
        { key: 'ruta', label: 'Ruta', filterable: false },
    ];

    const actionRoutes = {
        view: (id) => `/funcionalidades/read/${id}`,
        edit :(id) => `/funcionalidades/edit/${id}`,
        delete: (id) => `/funcionalidades/delete/${id}`
    };

    const actionsVisibility = {
        showView: true,
        showEdit: true,
        showDelete: true
    };

  if (!session) {signIn();return null;}
  
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

export default FuncionalidadesRead;