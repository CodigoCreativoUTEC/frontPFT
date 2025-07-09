import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Crear from "@/components/Paginas/Proveedores/Crear";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Proveedor",
  description: "Crear nuevo proveedor",
};

const CrearProveedorPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Crear Proveedor" />
      <div className="flex flex-col gap-10">
        <Crear />
      </div>
    </DefaultLayout>
  );
};

export default CrearProveedorPage; 