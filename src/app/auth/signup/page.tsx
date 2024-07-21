import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/Login/Registrar";
import LoginLayout from "@/components/Layouts/LoginLayout";

export const metadata: Metadata = {
  title: "Ingreso al sistema",
  description: "Página de ingreso al sistema",
};


const Registrarse: React.FC = function() {

  return (

      <Registrar />

  );
};

export default Registrarse;