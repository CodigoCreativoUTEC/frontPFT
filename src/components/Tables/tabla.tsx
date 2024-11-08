'use client'; // Asegúrate de incluir esto
import { data } from 'jquery';
import DynamicTable from '../DynamicTable';
import { useSession } from 'next-auth/react';

const ReportPage = () => {
  const session = useSession();
  const token = session.data?.accessToken || ''; // Obtener el token de la sesión

  // Endpoint base para obtener datos generales
  const baseEndpoint = "http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/listar";
  const deleteEndpoint = "http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/inactivar?id=";

  // Filtros con sus respectivos endpoints
  const filters = {
    estado: { value: 'ACTIVO', endpoint: baseEndpoint },
    ci: { value: '', endpoint: "http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/BuscarUsuarioPorCI" },
    pais: { value: '', endpoint: baseEndpoint }
  };

  const actionsVisibility = {
    showView: true,
    showEdit: true,
    showDelete: true,
  };

    // Rutas de acciones
    const actionRoutes = {
      view: (id: number) => `/usuarios/read/${id}`,
      edit: (id: number) => `/usuarios/edit/${id}`,
      delete: (id: number) => `/usuarios/delete/${id}`,
    };

  // Columnas de la tabla
  const columns = [
    { key: 'nombre', label: 'Nombre', filterable: true },
    { key: 'apellido', label: 'Apellido', filterable: true },
    { key: 'ci', label: 'CI', data: 'cedula', filterable: true },
    { key: 'telefono', data: 'usuariosTelefonos', label: 'Teléfono', filterable: true },
    { key: 'fechaNacimiento', label: 'Fecha de Nacimiento', filterable: true, isDate: true },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'nombreUsuario', label: 'Nombre de Usuario', filterable: true },
    { key: 'perfil', data: 'idPerfil.nombrePerfil', label: 'Perfil', filterable: true },
    { key: 'estado', label: 'Estado', filterable: true },
  ];

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
      
      />
    </div>
  );
};

export default ReportPage;
