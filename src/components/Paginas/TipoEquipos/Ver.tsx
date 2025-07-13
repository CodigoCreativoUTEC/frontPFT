"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";
import DetailView, { Column } from "@/components/Helpers/DetailView";

interface TipoEquipo {
  id: number;
  nombreTipo: string;
  estado: string;
}

const VerTipoEquipo: React.FC = () => {
  const params = useParams();
  const [tipoEquipo, setTipoEquipo] = useState<TipoEquipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTipoEquipo = async () => {
      try {
        const data = await fetcher<TipoEquipo>(`/tipoEquipos/seleccionar?id=${params.id}`);
        if (data) {
          setTipoEquipo(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTipoEquipo();
  }, [params.id]);

  const columns: Column<TipoEquipo>[] = [
    {
      header: "ID",
      accessor: "id"
    },
    {
      header: "Nombre",
      accessor: "nombreTipo"
    },
    {
      header: "Estado",
      accessor: (tipo) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          tipo.estado === "ACTIVO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {tipo.estado}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      {loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
          <p className="text-blue-700">Cargando...</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}
      {!loading && !error && !tipoEquipo && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
          <p className="text-yellow-700">No se encontró el tipo de equipo.</p>
        </div>
      )}
      {tipoEquipo && (
        <DetailView<TipoEquipo>
          data={tipoEquipo}
          columns={columns}
          backLink="/tipoEquipos"
          showEditButton={true}
        />
      )}
    </div>
  );
};

export default VerTipoEquipo;