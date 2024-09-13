import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditMarca from "@/components/Marcas/editarMarca";

export const metadata: Metadata = {
    title: "Editar marca",
    description: "Editar marca ingresada",
};

const editarMarca: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar marca" />
            <EditMarca />
        </DefaultLayout>
    );
};

export default editarMarca;
