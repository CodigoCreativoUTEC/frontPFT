"use client";
import React from "react";
import ViewDynamic from "@/components/Helpers/DetailView";

const fields = [
  { name: "id", label: "ID" },
  { name: "nombre", label: "Nombre" },
  { name: "estado", label: "Estado" },
];

const VerMarca: React.FC<{ id: number }> = ({ id }) => {
  return (
    <ViewDynamic
      title="Detalle de Marca"
      endpoint={`/marca/ver/${id}`}
      fields={fields}
      id={id}
      backPath="/marca"
    />
  );
};

export default VerMarca; 