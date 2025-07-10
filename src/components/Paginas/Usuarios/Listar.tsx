"use client";
import React, { useState, useEffect } from "react";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";
import fetcher from "@/components/Helpers/Fetcher";

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

  const columns: Column<Usuario>[] = [
    { header: "Cédula", accessor: "cedula", type: "text", filterable: true },
    { header: "Nombre de Usuario", accessor: "nombreUsuario", type: "text", filterable: true },
    { header: "Email", accessor: "email", type: "text", filterable: true },
    { header: "Nombre", accessor: "nombre", type: "text", filterable: true },
    { header: "Apellido", accessor: "apellido", type: "text", filterable: true },
    { header: "Fecha de Nacimiento", accessor: "fechaNacimiento", type: "date", filterable: true },
    { header: "Estado", accessor: "estado", type: "text", filterable: true },
  ];

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
    handleSearch({ estado: "ACTIVO" });
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Usuarios</h2>
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
          deleteUrl="/usuarios/inactivar"
          basePath="/usuarios"
          confirmDeleteMessage="¿Está seguro que desea dar de baja a este usuario?"
        />
      )}
    </>
  );
};

export default ListarUsuarios;
