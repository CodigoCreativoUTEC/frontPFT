"use client";
import React from "react";
import EditDynamic, { Field } from "@/components/Helpers/EditDynamic";
import { Perfil } from "@/types/Usuario"; // Ajusta la ruta según corresponda

const fields: Field<Perfil>[] = [
  { label: "Nombre del Perfil", accessor: "nombrePerfil", type: "text", validate: (value) => value ? undefined : "El nombre del perfil es obligatorio" },
  { label: "Estado", 
    accessor: "estado", 
    type: "dropdown", 
      options: [
        { id: "ACTIVO", label: "ACTIVO" },
        { id: "INACTIVO", label: "INACTIVO" },
  ], },
];

const Editar: React.FC = () => {
  return (
        <EditDynamic<Perfil>
          fetchUrl="/perfiles/seleccionar"
          updateUrl="/perfiles/modificar"
          fields={fields}
          backLink="/perfiles"
          successRedirect="/perfiles"
        />
  );
};

export default Editar;
