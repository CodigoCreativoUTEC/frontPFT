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

  // Removemos handleSearch y useEffect ya que DynamicTable manejará la carga automática

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
          filterUrl="/marca/filtrar"
          onDataUpdate={setMarcas}
          withActions={true}
          deleteUrl="/marca/inactivar"
          basePath="/marca"
          initialFilters={{ estado: "ACTIVO" }}
          sendOnlyId={true}
        />
      )}
    </>
  );
};

export default ListarMarcas; 