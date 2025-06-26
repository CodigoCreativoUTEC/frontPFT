"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";
import { Perfil } from "@/types/Usuario";


const Listar: React.FC = () => {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
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
      const data = await fetcher<Perfil[]>(`/perfiles/listar${queryString}`, { method: "GET" });
      setPerfiles(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Cargar datos sin filtros al montar el componente
    handleSearch({});
  }, []);

  const columns: Column<Perfil>[] = [
    { header: "Nombre de Perfil", accessor: "nombrePerfil", type: "text", filterable: true },
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
          data={perfiles}
          withFilters={true}
          onSearch={handleSearch}
          withActions={true}
          deleteUrl="/perfiles/inactivar"
          basePath="/perfiles"
          onDelete={async (id) => {
            // El id va en la URL, el body puede ir vacío o no enviarse
            return await fetcher<{ message: string }>(`/perfiles/inactivar?id=${id}`, {
              method: "PUT",
            });
          }}
        />
      )}
    </>
  );
};

export default Listar;
