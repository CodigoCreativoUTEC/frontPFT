import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditProveedor from "@/components/Proveedores/editarProveedor";

export const metadata: Metadata = {
    title: "Editar proveedor",
    description: "Editar proveedor ingresado",
};

const editarProveedor: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar proveedor" />
            <EditProveedor />
        </DefaultLayout>
    );
};

export default editarProveedor;
