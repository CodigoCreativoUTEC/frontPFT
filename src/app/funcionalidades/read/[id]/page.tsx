import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import FuncionalidadDetail from "@/components/Funcionalidades/verFuncionalidades";

export const metadata: Metadata = {
    title: "Detalles de la funcionalidad",
    description: "Funcionalidad con datos completos",
};

const detalleFuncionalidad: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Detalles de la funcionalidad" />
            <FuncionalidadDetail />
        </DefaultLayout>
    );
};

export default detalleFuncionalidad;
