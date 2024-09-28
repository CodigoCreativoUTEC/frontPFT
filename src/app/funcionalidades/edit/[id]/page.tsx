import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditFuncionalidad from "@/components/Funcionalidades/editarFuncionalidad";

export const metadata: Metadata = {
    title: "Editar funcionalidad",
    description: "Editar funcionalidad ingresada",
};

const editarFuncionalidad: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar funcionalidad" />
            <EditFuncionalidad />
        </DefaultLayout>
    );
};

export default editarFuncionalidad;
