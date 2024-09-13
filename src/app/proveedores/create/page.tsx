import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/Proveedores/crearProveedor";

export const metadata: Metadata = {
    title: "Agregar proveedor",
    description: "Página para agregar proveedor en el sistema",
};

const agregarProveedor: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar nuevo proveedor" />
            <Registrar />
        </DefaultLayout>
    );
};

export default agregarProveedor;
