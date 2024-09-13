import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MarcasRead from "@/components/Marcas/listarMarcas";

export const metadata: Metadata = {
    title: "Listado de marcas",
    description: "Listado de marcas ingresadas",
};

const listadoMarcas: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Lista de marcas" />
            <MarcasRead />
        </DefaultLayout>
    );
};

export default listadoMarcas;
