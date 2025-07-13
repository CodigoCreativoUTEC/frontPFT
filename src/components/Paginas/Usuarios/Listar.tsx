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
  const [perfiles, setPerfiles] = useState<IdPerfil[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cargar perfiles al montar el componente
  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const data = await fetcher<IdPerfil[]>("/perfiles/listar", { method: "GET" });
        setPerfiles(data);
      } catch (err: any) {
        console.error("Error al cargar perfiles:", err);
      }
    };
    fetchPerfiles();
  }, []);

  const columns: Column<Usuario>[] = [
    { header: "Cédula", accessor: "cedula", type: "text", filterable: true },
    { header: "Nombre", accessor: "nombre", type: "text", filterable: true },
    { header: "Apellido", accessor: "apellido", type: "text", filterable: true },
    { header: "Nombre de Usuario", accessor: "nombreUsuario", type: "text", filterable: true },
    { header: "Email", accessor: "email", type: "email", filterable: true },
    { 
      header: "Rol", 
      accessor: (row: Usuario) => row.idPerfil?.nombrePerfil || "",
      type: "dropdown", 
      options: perfiles.map(perfil => ({ 
        value: perfil.nombrePerfil, 
        label: perfil.nombrePerfil 
      })), 
      filterable: true,
      filterKey: "tipoUsuario" // Campo específico para el filtro en la URL
    },
    { header: "Estado", accessor: "estado", type: "text", filterable: true },
  ];



  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Usuarios</h2>
        <a
          href="/registroUsuario"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
          Agregar Usuario
        </a>
      </div>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <DynamicTable
        columns={columns}
        data={usuarios}
        withFilters={true}
        filterUrl="/usuarios/filtrar"
        initialFilters={{ estado: "ACTIVO" }}
        onDataUpdate={setUsuarios}
        withActions={true}
        deleteUrl="/usuarios/inactivar"
        basePath="/usuarios"
        confirmDeleteMessage="¿Está seguro que desea dar de baja a este usuario?"
        sendOnlyId={true}
        includeSinValidar={true}
      />
    </>
  );
};

export default ListarUsuarios;
