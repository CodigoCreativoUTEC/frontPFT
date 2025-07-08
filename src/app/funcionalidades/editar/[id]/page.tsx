import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import React from "react";
import EditarFuncionalidad from "@/components/Paginas/Funcionalidades/Editar";

export const metadata: Metadata = {
    title: "Editar Funcionalidad",
};

const EditarFuncionalidadPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar Funcionalidad" />
            <EditarFuncionalidad />
        </DefaultLayout>
    );
};

export default EditarFuncionalidadPage; 