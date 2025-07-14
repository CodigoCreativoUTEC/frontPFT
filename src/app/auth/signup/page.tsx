import React from "react";
import RegisterForm from "@/components/Helpers/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro de usuario",
  description: "Crea tu cuenta en MED-MGT",
};

const SignUp: React.FC = () => {
  return <RegisterForm />;
};

export default SignUp;
