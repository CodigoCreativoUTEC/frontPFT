"use client";
import React from "react";
import CreateDynamic from "@/components/Helpers/CreateDynamic";
import type { CreateDynamicField } from "@/components/Helpers/CreateDynamic";

const fields: CreateDynamicField[] = [
  { accessor: "nombre", label: "Nombre", type: "text" },
  { accessor: "estado", label: "Estado", type: "dropdown", options: [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ]},
];

const CrearMarca: React.FC = () => {
  return (
    <CreateDynamic
      fields={fields}
      createUrl="/marca/crear"
    />
  );
};

export default CrearMarca; 