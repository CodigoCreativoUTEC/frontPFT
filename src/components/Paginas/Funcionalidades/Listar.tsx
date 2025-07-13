"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

interface Perfil {
  id: number;
  nombrePerfil: string;
  estado: string;
}

interface Funcionalidad {
  id: number;
  nombreFuncionalidad: string;
  ruta: string;
  estado: string;
  perfiles: Perfil[];
}

const ListarFuncionalidades: React.FC = () => {
  const [funcionalidades, setFuncionalidades] = useState<Funcionalidad[]>([]);
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
      const data = await fetcher<Funcionalidad[]>(`/funcionalidades/listar${queryString}`, { method: "GET" });
      setFuncionalidades(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Cargar datos sin filtros al montar el componente
    handleSearch({});
  }, []);

  const columns: Column<Funcionalidad>[] = [
    { header: "Nombre", accessor: "nombreFuncionalidad", type: "text", filterable: true },
    { header: "Ruta", accessor: "ruta", type: "text", filterable: false },
    { header: "Estado", accessor: "estado", type: "text", filterable: true },
    {
      header: "Perfiles",
      accessor: (row) => row.perfiles.map(p => p.nombrePerfil).join(", "),
      type: "text",
      filterable: true
    }
  ];

  return (
    <>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DynamicTable
          columns={columns}
          data={funcionalidades}
          withFilters={true}
          onSearch={handleSearch}
          withActions={true}
          deleteUrl="/funcionalidades/eliminar"
          basePath="/funcionalidades"
          sendOnlyId={false}
        />
      )}
    </>
  );
};

export default ListarFuncionalidades; 