"use client";
import React from "react";
import EditDynamic, { Field } from "@/components/Helpers/EditDynamic";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Usuario } from "@/types/Usuario"; // Ajusta la ruta según corresponda

const fields: Field<Usuario>[] = [
  { label: "Cédula", accessor: "cedula", type: "text", validate: (value) => value ? undefined : "La cédula es obligatoria" },
  { label: "Email", accessor: "email", type: "email", validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? undefined : "El email no es válido";
    }
  },
  { label: "Nombre", accessor: "nombre", type: "text", validate: (value) => value ? undefined : "El nombre es obligatorio" },
  { label: "Apellido", accessor: "apellido", type: "text", validate: (value) => value ? undefined : "El apellido es obligatorio" },
  { 
    label: "Fecha de Nacimiento", 
    accessor: "fechaNacimiento", 
    type: "date", 
    validate: (value) => {
      if (!value) return "La fecha de nacimiento es obligatoria";
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18 ? undefined : "Debe tener al menos 18 años";
    }
  },
  { 
    label: "Estado", 
    accessor: "estado", 
    type: "dropdown",
    options: [
      { id: "SIN_VALIDAR", label: "Sin Validar" },
      { id: "ACTIVO", label: "Activo" },
      { id: "INACTIVO", label: "Inactivo" }
    ],
    optionValueKey: "id",
    optionLabelKey: "label"
  },
  { label: "Nombre de Usuario", accessor: "nombreUsuario", type: "text", readOnly: true },
  {
    label: "Perfil",
    accessor: "idPerfil",
    type: "dropdown",
    optionsEndpoint: "/perfiles/listar",
    optionValueKey: "id",
    optionLabelKey: "nombrePerfil",
    sendFullObject: true,
  },
];

const UserEdit: React.FC = () => {
  return (
    <EditDynamic<Usuario>
      fetchUrl="/usuarios/seleccionar"
      updateUrl="/usuarios/modificar"
      fields={fields}
      backLink="/usuarios"
      successRedirect="/usuarios"
    />
  );
};

export default UserEdit;
