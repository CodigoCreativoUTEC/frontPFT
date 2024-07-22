import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EquipoDetail from "@/components/Equipos/verEquipo";

export const metadata: Metadata = {
    title: "Detalle del de equipo",
    description: "Página con el detalle del equipo en el sistema",
};

const listarEquipos: React.FC = function() {
  return (
    <DefaultLayout>
        <Breadcrumb pageName="Detalle del equipo" />
        <EquipoDetail />
    </DefaultLayout>
  );
};

export default listarEquipos;