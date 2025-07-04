"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

interface Marca {
  id: number;
  nombre: string;
  estado: string;
}

const ListarMarcas: React.FC = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (filters: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const data = await fetcher<Marca[]>(`/marca/listar${queryString}`, { method: "GET" });
      setMarcas(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearch({});
  }, []);

  const columns: Column<Marca>[] = [
    { header: "ID", accessor: "id", type: "text", filterable: true },
    { header: "Nombre", accessor: "nombre", type: "text", filterable: true },
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
      <h2 className="text-xl font-bold mb-4">Marcas</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DynamicTable
          columns={columns}
          data={marcas}
          withFilters={true}
          onSearch={handleSearch}
          withActions={true}
          deleteUrl="/marca/inactivar"
          basePath="/marca"
        />
      )}
    </>
  );
};

export default ListarMarcas; 