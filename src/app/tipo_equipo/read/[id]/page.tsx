import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TipoEquipoDetail from "@/components/TipoEquipos/verTipoEquipos";

export const metadata: Metadata = {
    title: "Detalles del tipo de equipo",
    description: "Tipo de equipo con datos completos",
};

const detalleTipoEquipo: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Detalles del tipo de equipo" />
            <TipoEquipoDetail />
        </DefaultLayout>
    );
};

export default detalleTipoEquipo;
