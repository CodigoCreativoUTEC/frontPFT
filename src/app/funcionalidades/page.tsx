import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import FuncionalidadesRead from "@/components/Funcionalidades/listarFuncionalidades";

export const metadata: Metadata = {
    title: "Listado de funcionalidades",
    description: "Listado de funcionalidades ingresadas",
};

const listadoFuncionalidades: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Lista de funcionalidades" />
            <FuncionalidadesRead />
        </DefaultLayout>
    );
};

export default listadoFuncionalidades;
