import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ModeloDetail from "@/components/Modelos/verModelos"; // Cambiado para reflejar los modelos

export const metadata: Metadata = {
    title: "Detalles del modelo", // Cambiado a Modelo
    description: "Modelo con datos completos", // Cambiado a Modelo
};

const detalleModelo: React.FC = function() { // Cambiado a Modelo
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Detalles del modelo" /> // Cambiado a Modelo
            <ModeloDetail />
        </DefaultLayout>
    );
};

export default detalleModelo; // Cambiado a Modelo
