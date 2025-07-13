"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

interface Funcionalidad {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
}

const ListarFuncionalidades: React.FC = () => {
  const [funcionalidades, setFuncionalidades] = useState<Funcionalidad[]>([]);
  const [allFuncionalidades, setAllFuncionalidades] = useState<Funcionalidad[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Función para cargar todas las funcionalidades
  const loadFuncionalidades = async () => {
    setLoading(true);
    try {
      const data = await fetcher("/funcionalidades/listar");
      setAllFuncionalidades(data);
      setFuncionalidades(data.filter((func: Funcionalidad) => func.estado === "ACTIVO"));
      setError(null);
    } catch (err) {
      setError("Error al cargar las funcionalidades");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar búsqueda local
  const handleSearch = (filters: any) => {
    let filteredData = allFuncionalidades;

    // Filtrar por estado
    if (filters.estado) {
      filteredData = filteredData.filter((func: Funcionalidad) => 
        func.estado.toLowerCase().includes(filters.estado.toLowerCase())
      );
    }

    // Filtrar por nombre
    if (filters.nombre) {
      filteredData = filteredData.filter((func: Funcionalidad) => 
        func.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
      );
    }

    // Filtrar por descripción
    if (filters.descripcion) {
      filteredData = filteredData.filter((func: Funcionalidad) => 
        func.descripcion.toLowerCase().includes(filters.descripcion.toLowerCase())
      );
    }

    setFuncionalidades(filteredData);
  };

  useEffect(() => {
    loadFuncionalidades();
  }, []);

  const columns: Column<Funcionalidad>[] = [
    { header: "Nombre", accessor: "nombre", type: "text", filterable: true },
    { header: "Descripción", accessor: "descripcion", type: "text", filterable: true },
    { header: "Estado", accessor: "estado", type: "text", filterable: true },
  ];

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Funcionalidades</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DynamicTable
          columns={columns}
          data={funcionalidades}
          withFilters={true}
          onSearch={handleSearch}
          onDataUpdate={setFuncionalidades}
          withActions={true}
          deleteUrl="/funcionalidades/eliminar"
          basePath="/funcionalidades"
          initialFilters={{ estado: "ACTIVO" }}
          sendOnlyId={true}
          onReload={loadFuncionalidades}
        />
      )}
    </>
  );
};

export default ListarFuncionalidades; 