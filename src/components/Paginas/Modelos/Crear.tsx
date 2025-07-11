"use client";
import React, { useEffect, useState } from "react";
import CreateDynamic from "@/components/Helpers/CreateDynamic";
import fetcher from "@/components/Helpers/Fetcher";
import type { CreateDynamicField } from "@/components/Helpers/CreateDynamic";

const CrearModelo: React.FC = () => {
  const [marcas, setMarcas] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const data = await fetcher<any[]>("/marca/filtrar?estado=ACTIVO", { method: "GET" });
        setMarcas(data.map(m => ({ label: m.nombre, value: m.id })));
      } finally {
        setLoading(false);
      }
    };
    fetchMarcas();
  }, []);

  if (loading) return <p>Cargando marcas...</p>;
  if (marcas.length === 0) return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">No hay marcas activas. <a href="/marca/crear" className="underline text-blue-600">Cree una marca primero</a>.</div>;

  const fields: CreateDynamicField[] = [
    { accessor: "nombre", label: "Nombre del modelo", type: "text", required: true },
    { accessor: "idMarca", label: "Marca", type: "dropdown", required: true, options: marcas, sendFullObject: true },
  ];

  return (
    <CreateDynamic
      fields={fields}
      createUrl="/modelo/crear"
    />
  );
};

export default CrearModelo; 