import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditModelo from "@/components/Modelos/editarModelo";

export const metadata: Metadata = {
    title: "Editar modelo",
    description: "Editar modelo ingresado",
};

const editarModelo: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar modelo" />
            <EditModelo />
        </DefaultLayout>
    );
};

export default editarModelo;
