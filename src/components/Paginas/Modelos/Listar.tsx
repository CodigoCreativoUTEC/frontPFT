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
  const [allModelos, setAllModelos] = useState<Modelo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Función para cargar todos los modelos
  const loadModelos = async () => {
    setLoading(true);
    try {
      const data = await fetcher("/modelo/listar");
      setAllModelos(data);
      setModelos(data.filter((modelo: Modelo) => modelo.estado === "ACTIVO"));
      setError(null);
    } catch (err) {
      setError("Error al cargar los modelos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar búsqueda local
  const handleSearch = (filters: any) => {
    let filteredData = allModelos;

    // Filtrar por estado
    if (filters.estado) {
      filteredData = filteredData.filter((modelo: Modelo) => 
        modelo.estado.toLowerCase().includes(filters.estado.toLowerCase())
      );
    }

    // Filtrar por nombre
    if (filters.nombre) {
      filteredData = filteredData.filter((modelo: Modelo) => 
        modelo.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
      );
    }

    setModelos(filteredData);
  };

  useEffect(() => {
    loadModelos();
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
          onDataUpdate={setModelos}
          withActions={true}
          deleteUrl="/modelo/inactivar"
          basePath="/modelo"
          initialFilters={{ estado: "ACTIVO" }}
          sendOnlyId={true}
          onReload={loadModelos}
        />
      )}
    </>
  );
};

export default ListarModelos; 