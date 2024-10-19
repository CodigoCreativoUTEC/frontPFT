import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UsuariosRead from "@/components/Usuarios/listarUsuarios";

export const metadata: Metadata = {
  title: "Listado de usuarios",
  description: "listado de usuarios ingresados",
};


const listadoUsuarios: React.FC = function() {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Lista de usuarios" />
      <div className="flex flex-col gap-10">
      <UsuariosRead />
      </div>
    </DefaultLayout>
  );
};

export default listadoUsuarios;