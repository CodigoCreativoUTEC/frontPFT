import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Ingresar from "@/components/Login/Ingresar";

export const metadata: Metadata = {
  title: "Ingreso al sistema",
  description: "Pagina de ingreso al sistema",
};


const SignIn: React.FC = function() {

  return (
      <Ingresar />
  );
};

export default SignIn;