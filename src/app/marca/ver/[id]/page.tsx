import React from "react";
import VerMarca from "@/components/Paginas/Marcas/Ver";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle de marca",
};

const VerMarcaPage = () => (
  <DefaultLayout>
    <Breadcrumb pageName="Detalle de marca" />
    <div className="flex flex-col gap-10">
      <VerMarca />
    </div>
  </DefaultLayout>
);

export default VerMarcaPage; 