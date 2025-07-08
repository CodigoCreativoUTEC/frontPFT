"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";
import DetailView, { Column } from "@/components/Helpers/DetailView";

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

const VerModelo: React.FC = () => {
  const params = useParams();
  const id = Number(params.id);

  const [modelo, setModelo] = useState<Modelo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelo = async () => {
      try {
        const data = await fetcher<Modelo>(`/modelo/seleccionar?id=${id}`);
        setModelo(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchModelo();
  }, [id]);

  const columns: Column<Modelo>[] = [
    { header: "ID", accessor: "id" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Marca", accessor: (row) => row.idMarca?.nombre || "-" },
    { header: "Estado", accessor: (row) => {
      let colorClass = "";
      let label = row.estado;
      if (row.estado === "ACTIVO") {
        colorClass = "bg-green-100 text-green-800";
        label = "Activo";
      } else if (row.estado === "INACTIVO") {
        colorClass = "bg-red-100 text-red-800";
        label = "Inactivo";
      } else if (row.estado === "SIN_VALIDAR") {
        colorClass = "bg-yellow-100 text-yellow-800";
        label = "Sin validar";
      }
      return <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>{label}</span>;
    }},
  ];

  return (
    <div className="p-6">
      {loading && <p className="text-blue-700">Cargando...</p>}
      {error && <p className="text-red-700">Error: {error}</p>}
      {!loading && !error && !modelo && <p className="text-yellow-700">No se encontró el modelo.</p>}
      {modelo && (
        <DetailView<Modelo>
          data={modelo}
          columns={columns}
          backLink="/modelo"
        />
      )}
    </div>
  );
};

export default VerModelo; 