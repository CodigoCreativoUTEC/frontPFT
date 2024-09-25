import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/Funcionalidades/crearFuncionalidad";

export const metadata: Metadata = {
    title: "Agregar funcionalidad",
    description: "Página para agregar funcionalidad en el sistema",
};

const agregarFuncionalidad: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar nueva funcionalidad" />
            <Registrar />
        </DefaultLayout>
    );
};

export default agregarFuncionalidad;
