import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProveedoresRead from "@/components/Proveedores/listarProveedores";

export const metadata: Metadata = {
    title: "Listado de proveedores",
    description: "Listado de proveedores ingresados",
};

const listadoProveedores: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Lista de proveedores" />
            <ProveedoresRead />
        </DefaultLayout>
    );
};

export default listadoProveedores;
