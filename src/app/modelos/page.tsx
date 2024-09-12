import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ModelosRead from "@/components/Modelos/listarModelos"; // Cambiado a Modelos

export const metadata: Metadata = {
    title: "Listado de modelos", // Cambiado a Modelo
    description: "Listado de modelos ingresados", // Cambiado a Modelo
};

const listadoModelos: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Lista de modelos" />
            <ModelosRead />
        </DefaultLayout>
    );
};

export default listadoModelos;
