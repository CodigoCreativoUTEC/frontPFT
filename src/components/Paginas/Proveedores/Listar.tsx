"use client";
import React, { useState, useMemo } from "react";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

interface Pais {
  id: number;
  nombre: string;
  estado: string;
}

interface Proveedor {
  id: number;
  nombre: string;
  estado: string;
  pais: Pais;
}

const ListarProveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [error, setError] = useState<string | null>(null);

  const columns: Column<Proveedor>[] = useMemo(() => [
    { header: "Nombre", accessor: "nombre", type: "text", filterable: true },
    { header: "País", accessor: (row) => row.pais?.nombre || "-", type: "text", filterable: false },
    { header: "Estado", accessor: "estado", type: "text", filterable: true }
  ], []);

  return (
    <DynamicTable
      columns={columns}
      data={proveedores}
      withFilters={true}
      withActions={true}
      filterUrl="/proveedores/filtrar"
      initialFilters={{ estado: "ACTIVO" }}
      onDataUpdate={setProveedores}
      deleteUrl="/proveedores/inactivar"
      basePath="/proveedores"
      confirmDeleteMessage="¿Está seguro que desea dar de baja a este proveedor?"
      sendOnlyId={true}
    />
  );
};

export default ListarProveedores; 