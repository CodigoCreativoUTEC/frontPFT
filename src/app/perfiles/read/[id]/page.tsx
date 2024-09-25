import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
// @ts-ignore
import PerfilDetail from "@/components/Perfiles/verPerfil";

export const metadata: Metadata = {
    title: "Detalles del perfil",
    description: "Perfil con datos completos",
};

const detallePerfil: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Detalles del perfil" />
            <PerfilDetail />
        </DefaultLayout>
    );
};

export default detallePerfil;
