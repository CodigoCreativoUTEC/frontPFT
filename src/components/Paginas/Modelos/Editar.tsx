"use client";
import React, { useEffect, useState } from "react";
import EditDynamic from "@/components/Helpers/EditDynamic";
import fetcher from "@/components/Helpers/Fetcher";
import { useParams } from "next/navigation";

const EditarModelo: React.FC = () => {
  const { id } = useParams();
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

  const fields = [
    { accessor: "estado", label: "Estado", type: "dropdown", required: true, options: [
      { value: "ACTIVO", label: "Activo" },
      { value: "INACTIVO", label: "Inactivo" },
      { value: "SIN_VALIDAR", label: "Sin validar" },
    ]},
    { accessor: "idMarca", label: "Marca", type: "dropdown", required: true, options: marcas },
  ];

  return (
    <EditDynamic
      fetchUrl={`/modelo/seleccionar?id=${id}`}
      updateUrl="/modelo/modificar"
      fields={fields}
      backLink="/modelo"
      successRedirect="/modelo"
      title="Editar Modelo"
    />
  );
};

export default EditarModelo; 