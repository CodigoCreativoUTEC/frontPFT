import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditEquipo from "@/components/Equipos/editarEquipo";

export const metadata: Metadata = {
    title: "Editar el equipo",
    description: "Página para editar equipo en el sistema",
};

const editarEquipo: React.FC = function() {
  return (
    <DefaultLayout>
        <Breadcrumb pageName="Editar el equipo" />
        <EditEquipo />
    </DefaultLayout>
  );
};

export default editarEquipo;