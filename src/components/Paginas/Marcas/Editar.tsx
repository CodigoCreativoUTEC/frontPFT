"use client";
import React from "react";
import EditDynamic from "@/components/Helpers/EditDynamic";
import { useParams } from "next/navigation";

const fields = [
  { accessor: "nombre", label: "Nombre", type: "text", required: true, disabled: true },
];

const EditarMarca: React.FC = () => {
  const { id } = useParams();
  return (
    <EditDynamic
      title="Editar Marca"
      fetchUrl={`/marca/seleccionar`}
      updateUrl="/marca/modificar"
      fields={fields}
      backLink="/marca"
      successRedirect="/marca"
    />
  );
};

export default EditarMarca; 