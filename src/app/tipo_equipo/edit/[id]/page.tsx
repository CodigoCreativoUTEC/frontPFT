import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditTipoEquipo from "@/components/TipoEquipos/editarTipoEquipo";

export const metadata: Metadata = {
    title: "Editar tipo de equipo",
    description: "Editar tipo de equipo ingresado",
};

const editarTipoEquipo: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar tipo de equipo" />
            <EditTipoEquipo />
        </DefaultLayout>
    );
};

export default editarTipoEquipo;
