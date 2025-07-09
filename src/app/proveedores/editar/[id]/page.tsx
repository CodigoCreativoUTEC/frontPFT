import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Editar from "@/components/Paginas/Proveedores/Editar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Proveedor",
  description: "Editar proveedor existente",
};

const EditarProveedorPage = () => (
  
    <DefaultLayout>
      <Breadcrumb pageName="Editar Proveedor" />
      <div className="flex flex-col gap-10">
        <Editar />
      </div>
    </DefaultLayout>
  );

export default EditarProveedorPage; 