import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import Ingresar from "@/components/Login/Ingresar";
import LoginLayout from "@/components/Layouts/LoginLayout";

export const metadata: Metadata = {
  title: "Ingreso al sistema",
  description: "Página de ingreso al sistema",
};


const SignIn: React.FC = function() {

  return (

      <Ingresar />

  );
};

export default SignIn;