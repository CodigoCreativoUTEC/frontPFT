"use client";
import React from "react";
import EditDynamic, { Field } from "@/components/Helpers/EditDynamic";
import { Perfil } from "@/types/Usuario"; // Ajusta la ruta según corresponda

const fields: Field<Perfil>[] = [
  { disabled: true, label: "Nombre del Perfil", accessor: "nombrePerfil", type: "text", validate: (value) => value ? undefined : "El nombre del perfil es obligatorio" },
  { disabled: false, label: "Estado", accessor: "estado", type: "dropdown", options : [{id: "ACTIVO", label: "Activo"}, {id: "INACTIVO", label: "Inactivo"}], validate: (value) => value ? undefined : "El estado del perfil es obligatorio" },
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
