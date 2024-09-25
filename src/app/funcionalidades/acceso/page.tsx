import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ModificarAccesoFuncionalidades from "@/components/Funcionalidades/modificarAccesoFuncionalidades";

export const metadata: Metadata = {
    title: "Modificar Acceso de Funcionalidades",
    description: "Modificar las funcionalidades accesibles por perfil",
};

const modificarAccesoFuncionalidades: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Modificar Acceso de Funcionalidades" />
            <ModificarAccesoFuncionalidades />
        </DefaultLayout>
    );
};

export default modificarAccesoFuncionalidades;
