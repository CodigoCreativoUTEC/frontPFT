"use client";
import React from "react";
import EditDynamic, { Field } from "@/components/Helpers/EditDynamic";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

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
        { id: "SIN_VALIDAR", label: "Sin validar" }
      ],
      optionValueKey: "id",
      optionLabelKey: "label"
    },
    { 
      label: "Marca", 
      accessor: "idMarca", 
      type: "dropdown", 
      optionsEndpoint: "/marca/filtrar?estado=ACTIVO",
      optionValueKey: "id",
      optionLabelKey: "nombre",
      sendFullObject: true
    }
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Editar Modelo" />
      <EditDynamic<Modelo>
        fetchUrl="/modelo/seleccionar"
        updateUrl="/modelo/modificar"
        fields={fields}
        backLink="/modelo"
        successRedirect="/modelo"
      />
    </DefaultLayout>
  );
};

export default EditarModelo; 