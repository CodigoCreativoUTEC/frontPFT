import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import React from "react";
import CrearFuncionalidad from "@/components/Paginas/Funcionalidades/Crear";

export const metadata: Metadata = {
    title: "Crear Funcionalidad",
};

const CrearFuncionalidadPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Crear Funcionalidad" />
            <CrearFuncionalidad />
        </DefaultLayout>
    );
};

export default CrearFuncionalidadPage; 