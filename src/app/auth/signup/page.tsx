import React from "react";
import { Metadata } from "next";
import Registrar from "@/components/Usuarios/Login/Registrar";

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