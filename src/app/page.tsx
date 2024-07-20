import Login from "@/components/Login/Ingresar";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "MA-MED - Iniciar Sesión",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
        <Login />
  );
}
