import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Ver from "@/components/Paginas/Proveedores/Ver";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ver Proveedor",
  description: "Ver detalles del proveedor",
};

const VerProveedorPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Ver Proveedor" />
      <Ver />
    </DefaultLayout>
  );
};

export default VerProveedorPage; 