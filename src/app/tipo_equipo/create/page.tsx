import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/TipoEquipos/crearTipoEquipo";

export const metadata: Metadata = {
    title: "Agregar tipo de equipo",
    description: "Página para agregar tipo de equipo en el sistema",
};

const agregarTipoEquipo: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar nuevo tipo de equipo" />
            <Registrar />
        </DefaultLayout>
    );
};

export default agregarTipoEquipo;
