"use client";
import React, { useState } from "react";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

interface Pais {
  id: number;
  nombre: string;
  estado: string;
}

const ListarPaises: React.FC = () => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [error, setError] = useState<string | null>(null);

  const columns: Column<Pais>[] = [
    { header: "Nombre", accessor: "nombre", type: "text", filterable: true },
    { header: "Estado", accessor: "estado", type: "text", filterable: true }
    
  ];

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Países</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <DynamicTable
        columns={columns}
        data={paises}
        withFilters={true}
        withActions={true}
        filterUrl="/paises/filtrar"
        onDataUpdate={setPaises}
        deleteUrl="/paises/inactivar"
        basePath="/paises"
        initialFilters={{ estado: "ACTIVO" }}
        confirmDeleteMessage="¿Está seguro que desea dar de baja a este país?"
        sendOnlyId={true}
      />
    </>
  );
};

export default ListarPaises; 