import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/Modelos/crearModelo";

export const metadata: Metadata = {
    title: "Agregar modelo",
    description: "Página para agregar modelo en el sistema",
};

const agregarModelo: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar nuevo modelo" />
            <Registrar />
        </DefaultLayout>
    );
};

export default agregarModelo;
