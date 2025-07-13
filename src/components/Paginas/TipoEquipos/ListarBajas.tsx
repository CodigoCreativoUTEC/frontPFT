"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

interface TipoEquipo {
  id: number;
  nombreTipo: string;
  estado: string;
}

const ListarBajasTiposEquipos: React.FC = () => {
  const [tipos, setTipos] = useState<TipoEquipo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (filters: Record<string, string>) => {
    setLoading(true);
    try {
      const data = await fetcher<TipoEquipo[]>("/tipoEquipos/listar", { method: "GET" });
      setTipos(data.filter(t => t.estado !== "ACTIVO"));
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearch({});
  }, []);

  const columns: Column<TipoEquipo>[] = [
    { header: "ID", accessor: "id", type: "number", filterable: false },
    { header: "Nombre", accessor: "nombreTipo", type: "text", filterable: true },
    { 
      header: "Estado", 
      accessor: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.estado === "ACTIVO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {row.estado}
        </span>
      ),
      type: "text",
      filterable: true 
    }
  ];

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Tipos de equipos inactivos</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DynamicTable
          columns={columns}
          data={tipos}
          withFilters={true}
          onSearch={handleSearch}
          withActions={false}
        />
      )}
    </>
  );
};

export default ListarBajasTiposEquipos;