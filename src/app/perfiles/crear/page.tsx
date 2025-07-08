// src/app/perfiles/crear/page.tsx
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import React from "react";
import CrearPerfil from "@/components/Paginas/Perfiles/Crear";


export const metadata: Metadata = {
    title: "Creacion de Perfil",
  };
  
  const CrearPerfilPage = () => {
    return (
      <DefaultLayout>
              <Breadcrumb pageName="Creacion de Perfil" />
              <CrearPerfil />
      </DefaultLayout>
    );
  }
  
  export default CrearPerfilPage;


