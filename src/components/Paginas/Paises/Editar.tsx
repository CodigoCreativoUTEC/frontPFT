"use client";
import React from "react";
import EditDynamic from "@/components/Helpers/EditDynamic";
import { useParams } from "next/navigation";
import type { Field } from "@/components/Helpers/EditDynamic";

const EditarPais: React.FC = () => {
  const { id } = useParams();
  
  const fields: Field<any>[] = [
    { accessor: "nombre", label: "Nombre del país", type: "text", readOnly: true },
    { 
      accessor: "estado", 
      label: "Estado", 
      type: "dropdown", 
      options: [
        { id: "ACTIVO", label: "Activo" }, 
        { id: "INACTIVO", label: "Inactivo" }
      ],
      optionValueKey: "id",
      optionLabelKey: "label"
    },
  ];

  return (
    <EditDynamic
      fetchUrl={`/paises/seleccionar`}
      updateUrl="/paises/modificar"
      fields={fields}
      backLink="/paises"
      successRedirect="/paises"
    />
  );
};

export default EditarPais; 