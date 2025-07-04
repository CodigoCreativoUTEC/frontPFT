"use client";
import React from "react";
import CreateDynamic from "@/components/Helpers/CreateDynamic";

const fields = [
  { accessor: "nombre", label: "Nombre", type: "text", required: true },
  { accessor: "estado", label: "Estado", type: "dropdown", required: true, options: [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Eliminados" },
  ]},
];

const CrearMarca: React.FC = () => {
  return (
    <CreateDynamic
      title="Agregar Marca"
      endpoint="/marca/crear"
      fields={fields}
      redirectPath="/marca"
      createUrl="/marca/crear"
    />
  );
};

export default CrearMarca; 