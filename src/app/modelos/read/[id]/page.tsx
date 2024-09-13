import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ModeloDetail from "@/components/Modelos/verModelos";

export const metadata: Metadata = {
    title: "Detalles del modelo",
    description: "Modelo con datos completos",
};

const detalleModelo: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Detalles del modelo" />
            <ModeloDetail />
        </DefaultLayout>
    );
};

export default detalleModelo;
