import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/Perfiles/crearPerfil";

export const metadata: Metadata = {
    title: "Agregar perfil",
    description: "Página para agregar perfil en el sistema",
};

const agregarPerfil: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar nuevo perfil" />
            <Registrar />
        </DefaultLayout>
    );
};

export default agregarPerfil;
