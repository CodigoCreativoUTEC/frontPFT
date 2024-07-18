import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UsuariosRead from "@/components/usuarios/listar";

export const metadata: Metadata = {
  title: "Listado de usuarios",
  description: "listado de usuarios ingresados",
};


const listadoUsuarios: React.FC = function() {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de usuarios" />
      <UsuariosRead />
    </DefaultLayout>
  );
};

export default listadoUsuarios;