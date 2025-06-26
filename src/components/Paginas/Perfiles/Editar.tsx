"use client";
import React from "react";
import EditDynamic, { Field } from "@/components/Helpers/EditDynamic";
import { Perfil } from "@/types/Usuario"; // Ajusta la ruta según corresponda

//TODO: Segun requerimientos no se podria editar el nombre del perfil, y tampoco el estado
//TODO: Por lo tanto si es necesario editar el nombre se debe dejar el campo como disabled en false

const fields: Field<Perfil>[] = [
  { disabled: true, label: "Nombre del Perfil", accessor: "nombrePerfil", type: "text", validate: (value) => value ? undefined : "El nombre del perfil es obligatorio" },
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
