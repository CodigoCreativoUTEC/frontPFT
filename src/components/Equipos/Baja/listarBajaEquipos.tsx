"use client";
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import DynamicTable from '@/components/DynamicTable';
import { isDate } from 'date-fns';

const EquiposBaja = () => {
  const { data: session } = useSession();
    const token = session?.accessToken ?? ''; // Obtener el token de la sesión

    // Endpoint base para obtener datos generales
    const baseEndpoint = process.env.NEXT_PUBLIC_API_URL + "/equipos/listarBajas";

    // Columnas de la tabla
    const columns = [
        { key: 'id', label: 'ID', filterable: false },
        { key: 'razon', label: 'Razón', filterable: false },
        { key: 'fecha', label: 'fecha', filterable: false },
        { data: 'idUsuario.email', label: 'Usuario', filterable: false },
        { data: `idEquipo.idInterno`, label: 'Equipo', filterable: false },
        { key: 'comentarios', label: 'Comentarios', filterable: false },
        { key: 'estado', label: 'Estado', filterable: false } // Estado no editable, siempre "ACTIVO"
    ];

    const actionRoutes = {
        view: (id) => `/equipos/baja/${id}`,
    };

    const actionsVisibility = {
        showView: true,
        showEdit: false,
        showDelete: false
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
    useDeleteModal={false}
    />
</div>
  );
}

export default EquiposBaja;