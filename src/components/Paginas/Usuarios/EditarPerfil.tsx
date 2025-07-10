"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import EditDynamic, { Field } from "@/components/Helpers/EditDynamic";
import { Usuario } from "@/types/Usuario";

/**
 * Campos permitidos para edición de perfil propio
 * Excluye campos sensibles como estado, perfil, institución
 */
const fields: Field<Usuario>[] = [
  { 
    label: "Cédula", 
    accessor: "cedula", 
    type: "text", 
    required: true,
    validate: (value) => {
      if (!value) return "La cédula es obligatoria";
      if (value.length < 7 || value.length > 10) return "La cédula debe tener entre 7 y 10 dígitos";
      return undefined;
    }
  },
  { 
    label: "Email", 
    accessor: "email", 
    type: "email", 
    required: true,
    validate: (value) => {
      if (!value) return "El email es obligatorio";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? undefined : "El email no es válido";
    }
  },
  { 
    label: "Nombre", 
    accessor: "nombre", 
    type: "text", 
    required: true,
    validate: (value) => {
      if (!value) return "El nombre es obligatorio";
      if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
      return undefined;
    }
  },
  { 
    label: "Apellido", 
    accessor: "apellido", 
    type: "text", 
    required: true,
    validate: (value) => {
      if (!value) return "El apellido es obligatorio";
      if (value.length < 2) return "El apellido debe tener al menos 2 caracteres";
      return undefined;
    }
  },
  { 
    label: "Fecha de Nacimiento", 
    accessor: "fechaNacimiento", 
    type: "date",
    validate: (value) => {
      if (!value) return undefined; // Campo opcional
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 16) return "Debe tener al menos 16 años";
      if (age > 100) return "Fecha de nacimiento no válida";
      return undefined;
    }
  },
  { 
    label: "Nombre de Usuario", 
    accessor: "nombreUsuario", 
    type: "text", 
    validate: (value) => {
      if (!value) return undefined; // Campo opcional
      if (value.length < 3) return "El nombre de usuario debe tener al menos 3 caracteres";
      if (!/^[a-zA-Z0-9._-]+$/.test(value)) return "Solo se permiten letras, números, puntos, guiones y guiones bajos";
      return undefined;
    }
  },
  // Campos de solo lectura para mostrar información del perfil
  { 
    label: "Estado", 
    accessor: "estado", 
    type: "text", 
    readOnly: true 
  }
];

interface EditarPerfilProps {
  userId?: number;
}

const EditarPerfil: React.FC<EditarPerfilProps> = ({ userId }) => {
  const { data: session } = useSession();
  
  // Obtener el ID del usuario de la sesión o usar el proporcionado
  const userIdToUse = userId || session?.user?.id;
  
  if (!userIdToUse) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="text-center">
          <p>Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <EditDynamic<Usuario>
      fetchUrl={`/usuarios/seleccionar?id=${userIdToUse}`}
      updateUrl="/usuarios/modificar-propio-usuario"
      fields={fields}
      backLink="/profile"
      successRedirect="/profile"
    />
  );
};

export default EditarPerfil; 