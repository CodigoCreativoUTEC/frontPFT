import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import IntervencionesRead from "@/components/Intervenciones/listarIntervenciones";

export const metadata: Metadata = {
    title: "Listado de intervenciones",
    description: "Listado de intervenciones ingresadas",
};

const listadoIntervenciones: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Lista de intervenciones" />
            <IntervencionesRead />
        </DefaultLayout>
    );
};

export default listadoIntervenciones;
