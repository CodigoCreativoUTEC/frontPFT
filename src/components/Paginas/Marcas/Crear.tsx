"use client";
import React from "react";
import CreateDynamic from "@/components/Helpers/CreateDynamic";

const fields = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "estado", label: "Estado", type: "select", required: true, options: [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ]},
];

const CrearMarca: React.FC = () => {
  return (
    <CreateDynamic
      title="Agregar Marca"
      endpoint="/marca/crear"
      fields={fields}
      redirectPath="/marca"
    />
  );
};

export default CrearMarca; 