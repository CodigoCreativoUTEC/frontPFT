import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProveedorDetail from "@/components/Proveedores/verProveedores";

export const metadata: Metadata = {
    title: "Detalles del proveedor",
    description: "Proveedor con datos completos",
};

const detalleProveedor: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Detalles del proveedor" />
            <ProveedorDetail />
        </DefaultLayout>
    );
};

export default detalleProveedor;
