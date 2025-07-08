import React from "react";
import RegisterForm from "@/components/Helpers/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro de usuario | MA-MED",
  description: "Crea tu cuenta en MA-MED",
};

const SignUp: React.FC = () => {
  return <RegisterForm />;
};

export default SignUp;
