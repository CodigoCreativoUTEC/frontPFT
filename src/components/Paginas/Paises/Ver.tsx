"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";
import DetailView, { Column } from "@/components/Helpers/DetailView";

interface Pais {
  id: number;
  nombre: string;
  estado: string;
}

const VerPais: React.FC = () => {
  const params = useParams();
  const id = Number(params.id);

  const [pais, setPais] = useState<Pais | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPais = async () => {
      try {
        const data = await fetcher<Pais>(`/paises/seleccionar?id=${id}`);
        setPais(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPais();
  }, [id]);

  const columns: Column<Pais>[] = [
    { header: "ID", accessor: "id" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Estado", accessor: "estado" },
  ];

  return (
    <div className="p-6">
      {loading && <p className="text-blue-700">Cargando...</p>}
      {error && <p className="text-red-700">Error: {error}</p>}
      {!loading && !error && !pais && <p className="text-yellow-700">No se encontró el país.</p>}
      {pais && (
        <DetailView<Pais>
          data={pais}
          columns={columns}
          backLink="/paises"
        />
      )}
    </div>
  );
};

export default VerPais; 