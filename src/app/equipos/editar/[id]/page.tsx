import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import React from "react";
import EditarEquipo from "@/components/Paginas/Equipos/Editar";

export const metadata: Metadata = {
    title: "Editar Equipo",
};

const EditarEquipoPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar Equipo" />
            <EditarEquipo />
        </DefaultLayout>
    );
};

export default EditarEquipoPage; 