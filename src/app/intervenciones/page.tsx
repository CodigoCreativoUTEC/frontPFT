import React from "react";
import ListarIntervenciones from "@/components/Paginas/Intervenciones/Listar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intervenciones",
};

const IntervencionesPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Intervenciones" />
      <ListarIntervenciones />
    </DefaultLayout>
  );
};

export default IntervencionesPage; 