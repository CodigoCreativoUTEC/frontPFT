"use client";
import React from "react";
import EditDynamic, { Field } from "@/components/Helpers/EditDynamic";

interface Modelo {
  id: number;
  nombre: string;
  estado: string;
  idMarca: {
    id: number;
    nombre: string;
    estado: string;
  };
}

const EditarModelo: React.FC = () => {
  const fields: Field<Modelo>[] = [
    { 
      label: "Nombre", 
      accessor: "nombre", 
      type: "text",
      validate: (value) => value ? undefined : "El nombre es obligatorio"
    },
    { 
      label: "Estado", 
      accessor: "estado", 
      type: "dropdown", 
      options: [
        { id: "ACTIVO", label: "Activo" },
        { id: "INACTIVO", label: "Inactivo" },
      ],
      optionValueKey: "id",
      optionLabelKey: "label"
    },
    { 
      label: "Marca", 
      accessor: "idMarca", 
      type: "dropdown", 
      optionsEndpoint: "/marca/listar",
      optionValueKey: "id",
      optionLabelKey: "nombre",
      sendFullObject: true
    }
  ];

  return (
      <EditDynamic<Modelo>
        fetchUrl="/modelo/seleccionar"
        updateUrl="/modelo/modificar"
        fields={fields}
        backLink="/modelo"
        successRedirect="/modelo"
      />
  );
};

export default EditarModelo; 