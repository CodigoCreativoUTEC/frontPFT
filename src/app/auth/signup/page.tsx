import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/Login/Registrar";

export const metadata: Metadata = {
  title: "Ingreso al sistema",
  description: "Pagina de ingreso al sistema",
};


const Registrarse: React.FC = function() {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Ingresar" />
      
      <Registrar />

    </DefaultLayout>
  );
};

export default Registrarse;