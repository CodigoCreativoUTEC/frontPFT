"use client";
import React, { useMemo } from "react";
import CreateDynamic from "@/components/Helpers/CreateDynamic";

const CrearProveedor: React.FC = () => {
  const fields = useMemo(() => [
    {
      accessor: "nombre",
      label: "Nombre del Proveedor",
      type: "text" as const,
      required: true,
      placeholder: "Ingrese el nombre del proveedor"
    },
    {
      accessor: "pais",
      label: "País",
      type: "dropdown" as const,
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
      type: "dropdown" as const,
      required: true,
      options: [
        { label: "Activo", value: "ACTIVO" },
        { label: "Inactivo", value: "INACTIVO" }
      ],
      placeholder: "Seleccione el estado"
    }
  ], []);

  return (
    <CreateDynamic
      createUrl="/proveedores/crear"
      fields={fields}
      successMessage="Proveedor creado exitosamente"
    />
  );
};

export default CrearProveedor; 