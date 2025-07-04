"use client";
import React from "react";
import EditDynamic from "@/components/Helpers/EditDynamic";
import { useParams } from "next/navigation";
import type { Field } from "@/components/Helpers/EditDynamic";

const fields: Field<any>[] = [
  { accessor: "nombre", label: "Nombre", type: "text", disabled: true },
];

const EditarMarca: React.FC = () => {
  const { id } = useParams();
  return (
    <EditDynamic
      fetchUrl={`/marca/seleccionar`}
      updateUrl="/marca/modificar"
      fields={fields}
      backLink="/marca"
      successRedirect="/marca"
    />
  );
};

export default EditarMarca; 