"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

interface Modelo {
  id: number;
  nombre: string;
  estado: string;
  idMarca: {
    id: number;
    nombre: string;
    estado: string;
  } | null;
}

const ListarModelos: React.FC = () => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (filters: Record<string, string>) => {
    setLoading(true);
    try {
      let url = "/modelo/listar";
      if (filters.estado) {
        url = `/modelo/filtrar?estado=${filters.estado}`;
      }
      const data = await fetcher<Modelo[]>(url, { method: "GET" });
      setModelos(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearch({});
  }, []);

  const columns: Column<Modelo>[] = [
    { header: "Nombre", accessor: "nombre", type: "text", filterable: true },
    { header: "Marca", accessor: (row) => row.idMarca?.nombre || "-", type: "text", filterable: false },
    { header: "Estado", accessor: "estado", type: "text", filterable: true },
  ];

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Modelos</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DynamicTable
          columns={columns}
          data={modelos}
          withFilters={true}
          onSearch={handleSearch}
          withActions={true}
          deleteUrl="/modelo/inactivar"
          basePath="/modelo"
          initialFilters={{ estado: "ACTIVO" }}
        />
      )}
    </>
  );
};

export default ListarModelos; 