import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/Modelos/crearModelo"; // Cambiado a Modelos

export const metadata: Metadata = {
    title: "Agregar modelo", // Cambiado a Modelo
    description: "Página para agregar modelo en el sistema", // Cambiado a Modelo
};

const agregarModelo: React.FC = function() { // Cambiado a Modelo
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar nuevo modelo" /> // Cambiado a Modelo
            <Registrar />
        </DefaultLayout>
    );
};

export default agregarModelo; // Cambiado a Modelo
