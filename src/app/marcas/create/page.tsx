import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/Marcas/crearMarca";

export const metadata: Metadata = {
    title: "Agregar marca",
    description: "Página para agregar marca en el sistema",
};

const agregarMarca: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar nueva marca" />
            <Registrar />
        </DefaultLayout>
    );
};

export default agregarMarca;
