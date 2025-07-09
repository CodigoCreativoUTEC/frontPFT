"use client";
import React from "react";
import CreateDynamic from "@/components/Helpers/CreateDynamic";
import type { CreateDynamicField } from "@/components/Helpers/CreateDynamic";

const CrearPais: React.FC = () => {
  const fields: CreateDynamicField[] = [
    { accessor: "nombre", label: "Nombre del país", type: "text", required: true },
  ];

  return (
    <CreateDynamic
      fields={fields}
      createUrl="/paises/crear"
    />
  );
};

export default CrearPais; 