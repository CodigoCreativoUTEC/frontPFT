import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import IntervencionDetail from "@/components/Intervenciones/verIntervenciones";

export const metadata: Metadata = {
    title: "Detalles de la intervención",
    description: "Intervención con datos completos",
};

const detalleIntervencion: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Detalles de la intervención" />
            <IntervencionDetail />
        </DefaultLayout>
    );
};

export default detalleIntervencion;
