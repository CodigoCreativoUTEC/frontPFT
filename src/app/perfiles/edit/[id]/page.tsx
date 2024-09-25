import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditPerfil from "@/components/Perfiles/editarPerfil";

export const metadata: Metadata = {
    title: "Editar perfil",
    description: "Editar perfil ingresado",
};

const editarPerfil: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar perfil" />
            <EditPerfil />
        </DefaultLayout>
    );
};

export default editarPerfil;
