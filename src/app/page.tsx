import Login from "@/components/Login/Ingresar";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "MA-MED - Iniciar Sesión",
  description: "Sistema de gestión de mantenimiento de equipos clínicos hospitalarios.",
};

export default function Home() {
  return (
        <Login />
  );
}
