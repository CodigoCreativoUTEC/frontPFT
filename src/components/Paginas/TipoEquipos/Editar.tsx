"use client";
import React from "react";
import EditDynamic, { Field } from "@/components/Helpers/EditDynamic";

interface TipoEquipo {
  id: number;
  nombreTipo: string;
  estado: string;
}

const fields: Field<TipoEquipo>[] = [
  { label: "Nombre", accessor: "nombreTipo", type: "text", validate: (value) => value ? undefined : "El nombre es obligatorio" },
  { 
    label: "Estado", 
    accessor: "estado", 
    type: "dropdown",
    options: [
      { id: "ACTIVO", label: "Activo" },
      { id: "INACTIVO", label: "Inactivo" }
    ],
    optionValueKey: "id",
    optionLabelKey: "label"
  },
];

const TipoEquipoEdit: React.FC = () => {
  return (
    <EditDynamic<TipoEquipo>
      fetchUrl="/tipoEquipos/seleccionar"
      updateUrl="/tipoEquipos/modificar"
      fields={fields}
      backLink="/tipoEquipos"
      successRedirect="/tipoEquipos"
    />
  );
};

export default TipoEquipoEdit;