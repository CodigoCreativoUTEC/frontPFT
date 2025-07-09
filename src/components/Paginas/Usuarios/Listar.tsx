"use client";
import React, { useState } from "react";
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
      <h2 className="text-xl font-bold mb-4">Usuarios</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <DynamicTable
        columns={columns}
        data={usuarios}
        withFilters={true}
        withActions={true}
        filterUrl="/usuarios/filtrar"
        onDataUpdate={setUsuarios}
        deleteUrl="/usuarios/inactivar"
        basePath="/usuarios"
        initialFilters={{ estado: "ACTIVO" }}
        confirmDeleteMessage="¿Está seguro que desea dar de baja a este usuario?"
      />
    </>
  );
};

export default ListarUsuarios;
