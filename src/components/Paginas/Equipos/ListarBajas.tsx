"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

interface Equipo {
  id: number;
  idInterno: string;
  nroSerie: string;
  garantia: string | null;
  idTipo: {
    id: number;
    nombreTipo: string;
    estado: string;
  };
  idProveedor: {
    id: number;
    nombre: string;
    estado: string;
    pais: {
      id: number;
      nombre: string;
    };
  };
  idPais: {
    id: number;
    nombre: string;
  };
  idModelo: {
    id: number;
    nombre: string;
    idMarca: {
      id: number;
      nombre: string;
      estado: string;
    };
    estado: string;
  };
  idUbicacion: {
    id: number;
    nombre: string;
    sector: string;
    piso: number;
    numero: number;
    cama: string | null;
    idInstitucion: {
      id: number;
      nombre: string;
    };
    estado: string;
  };
  nombre: string;
  imagen: string;
  fechaAdquisicion: string;
  estado: string;
}

const ListarBajasEquipos: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
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
      const data = await fetcher<Equipo[]>(`/equipos/filtrar${queryString}`, { method: "GET" });
      setEquipos(data.filter(e => e.estado !== "ACTIVO"));
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearch({});
  }, []);

  const columns: Column<Equipo>[] = [
    { header: "ID Interno", accessor: "idInterno", type: "text", filterable: true },
    { header: "Nombre", accessor: "nombre", type: "text", filterable: true },
    { header: "Número de Serie", accessor: "nroSerie", type: "text", filterable: true },
    { 
      header: "Tipo", 
      accessor: (row) => row.idTipo?.nombreTipo || "-",
      type: "text",
      filterable: true 
    },
    { 
      header: "Modelo", 
      accessor: (row) => row.idModelo?.nombre || "-",
      type: "text",
      filterable: true 
    },
    { 
      header: "Marca", 
      accessor: (row) => row.idModelo?.idMarca?.nombre || "-",
      type: "text",
      filterable: true 
    },
    { 
      header: "Ubicación", 
      accessor: (row) => `${row.idUbicacion?.nombre} - ${row.idUbicacion?.sector}` || "-",
      type: "text",
      filterable: true 
    },
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
      <h2 className="text-xl font-bold mb-4">Equipos dados de baja</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DynamicTable
          columns={columns}
          data={equipos}
          withFilters={true}
          onSearch={handleSearch}
          withActions={false}
        />
      )}
    </>
  );
};

export default ListarBajasEquipos; 