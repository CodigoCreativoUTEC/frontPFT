"use client";
import React from "react";
import CreateDynamic from "@/components/Helpers/CreateDynamic";

const CrearPerfil = () => (
  <CreateDynamic
    createUrl="/perfiles/crear"
    fields={[
      { label: "Nombre del Perfil", accessor: "nombrePerfil", type: "text", required: true },
    ]}
    successMessage="Perfil creado exitosamente"
  />
);

export default CrearPerfil;
