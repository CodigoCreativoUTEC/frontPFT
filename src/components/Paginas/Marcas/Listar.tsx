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
      let url = "/marca/listar";
      if (filters.estado) {
        url = `/marca/filtrar?estado=${filters.estado}`;
      }
      const data = await fetcher<Marca[]>(url, { method: "GET" });
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
    { header: "Nombre", accessor: "nombre", type: "text", filterable: false },
    { 
      header: "Estado", 
      accessor: "estado",
      type: "text",
      filterable: true 
    },
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