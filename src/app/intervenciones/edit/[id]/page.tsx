import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditIntervencion from "@/components/Intervenciones/editarIntervencion";

export const metadata: Metadata = {
    title: "Editar intervención",
    description: "Editar intervención ingresada",
};

const editarIntervencion: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar intervención" />
            <EditIntervencion />
        </DefaultLayout>
    );
};

export default editarIntervencion;
