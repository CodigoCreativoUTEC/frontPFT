"use client";
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import EditDynamic from "@/components/Helpers/EditDynamic";
import type { Field } from "@/components/Helpers/EditDynamic";

const EditarProveedor: React.FC = () => {
  const { id } = useParams();
  
  const fields: Field<any>[] = useMemo(() => [
    {
      accessor: "nombre",
      label: "Nombre del Proveedor",
      type: "text",
      required: true,
      readOnly: true,
      placeholder: "Nombre del proveedor"
    },
    {
      accessor: "pais",
      label: "País",
      type: "dropdown",
      required: true,
      optionsEndpoint: "/paises/filtrar?estado=ACTIVO",
      optionValueKey: "id",
      optionLabelKey: "nombre",
      sendFullObject: true, // Enviar el objeto país completo
      placeholder: "Seleccione un país"
    },
    {
      accessor: "estado",
      label: "Estado",
      type: "dropdown",
      required: true,
      options: [
        { id: "ACTIVO", nombre: "Activo" },
        { id: "INACTIVO", nombre: "Inactivo" }
      ],
      optionValueKey: "id",
      optionLabelKey: "nombre",
      placeholder: "Seleccione el estado"
    }
  ], []);

  return (
    <EditDynamic
      fetchUrl={`/proveedores/seleccionar`}
      updateUrl="/proveedores/modificar"
      fields={fields}
      backLink="/proveedores"
    />
  );
};

export default EditarProveedor; 