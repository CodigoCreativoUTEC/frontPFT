'use client'; // Asegúrate de incluir esto
import DynamicTable from '../DynamicTable';
import { useSession } from 'next-auth/react';

const ReportPage = () => {
  const session = useSession();
  const token = session.data?.accessToken || ''; // Obtener el token de la sesión

  // Endpoint base para obtener datos generales
  const baseEndpoint = "http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/listar";

  // Filtros con sus respectivos endpoints
  const filters = {
    estado: { value: 'ACTIVO', endpoint: baseEndpoint },
    ci: { value: '', endpoint: "http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/BuscarUsuarioPorCI" },
    pais: { value: '', endpoint: baseEndpoint }
  };

  // Columnas de la tabla
  const columns = [
    { key: 'nombre', label: 'Nombre', filterable: true },
    { key: 'apellido', label: 'Apellido', filterable: true },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'estado', label: 'Estado', filterable: true },
    {
      key: 'pais',
      label: 'País',
      filterable: true,
      isDropdown: true,
      dropdownOptionsEndpoint: "http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/paises/listar"
    },
    {
      key: 'ci',
      label: 'CI',
      filterable: true
    }
  ];

  return (
    <div>
      <h1>Reporte de Usuarios</h1>
      <DynamicTable baseEndpoint={baseEndpoint} filters={filters} columns={columns} token={token} />
    </div>
  );
};

export default ReportPage;
