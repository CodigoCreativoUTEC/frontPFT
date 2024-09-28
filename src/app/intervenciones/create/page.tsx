import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/Intervenciones/crearIntervencion";

export const metadata: Metadata = {
    title: "Agregar intervención",
    description: "Página para agregar intervención en el sistema",
};

const agregarIntervencion: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar nueva intervención" />
            <Registrar />
        </DefaultLayout>
    );
};

export default agregarIntervencion;
