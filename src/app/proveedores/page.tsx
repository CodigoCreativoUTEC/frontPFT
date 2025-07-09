import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Listar from "@/components/Paginas/Proveedores/Listar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proveedores",
  description: "Gestión de proveedores",
};

const ProveedoresPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Proveedores" />
      <div className="flex flex-col gap-10">
        <Listar />
      </div>
    </DefaultLayout>
  );
};

export default ProveedoresPage; 