import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TipoEquiposRead from "@/components/TipoEquipos/listarTipoEquipos";

export const metadata: Metadata = {
    title: "Listado de tipos de equipo",
    description: "Listado de tipos de equipo ingresados",
};

const listadoTipoEquipos: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Lista de tipos de equipo" />
            <TipoEquiposRead />
        </DefaultLayout>
    );
};

export default listadoTipoEquipos;
