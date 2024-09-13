import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MarcaDetail from "@/components/Marcas/verMarcas";

export const metadata: Metadata = {
    title: "Detalles de la marca",
    description: "Marca con datos completos",
};

const detalleMarca: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Detalles de la marca" />
            <MarcaDetail />
        </DefaultLayout>
    );
};

export default detalleMarca;
