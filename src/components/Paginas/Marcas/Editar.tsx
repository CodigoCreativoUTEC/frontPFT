"use client";
import React from "react";
import EditDynamic from "@/components/Helpers/EditDynamic";

const fields = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "estado", label: "Estado", type: "select", required: true, options: [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ]},
];

const EditarMarca: React.FC<{ id: number }> = ({ id }) => {
  return (
    <EditDynamic
      title="Editar Marca"
      endpoint={`/marca/editar/${id}`}
      fields={fields}
      id={id}
      redirectPath="/marca"
    />
  );
};

export default EditarMarca; 