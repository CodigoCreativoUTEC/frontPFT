"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

interface UsuariosTelefonos {
  id: number;
  numero: string;
}

interface IdInstitucion {
  id: number;
  nombre: string;
}

interface IdPerfil {
  id: number;
  nombrePerfil: string;
  estado: string;
}

interface Usuario {
  usuariosTelefonos: UsuariosTelefonos[];
  id: number;
  cedula: string;
  email: string;
  contrasenia: string;
  fechaNacimiento: string;
  estado: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  idInstitucion: IdInstitucion;
  idPerfil: IdPerfil;
}

const ListarUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Callback para búsqueda (filtros) desde DynamicTable
  const handleSearch = async (filters: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const data = await fetcher<Usuario[]>(`/usuarios/filtrar${queryString}`, { method: "GET" });
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Cargar datos sin filtros al montar el componente
    handleSearch({});
  }, []);

  const columns: Column<Usuario>[] = [
    { header: "Cédula", accessor: "cedula", type: "text", filterable: true },
    { header: "Nombre de Usuario", accessor: "nombreUsuario", type: "text", filterable: true },
    { header: "Email", accessor: "email", type: "text", filterable: true },
    { header: "Nombre", accessor: "nombre", type: "text", filterable: true },
    { header: "Apellido", accessor: "apellido", type: "text", filterable: true },
    { header: "Fecha de Nacimiento", accessor: "fechaNacimiento", type: "date", filterable: true },
    { header: "Estado", accessor: "estado", type: "text", filterable: true },
  ];

  return (
    
      <>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DynamicTable
          columns={columns}
          data={usuarios}
          withFilters={true}
          onSearch={handleSearch}
          withActions={true}
          deleteUrl="/usuarios/eliminar"
          basePath="/usuarios"
        />
      )}
    </>
  );
};

export default ListarUsuarios;
