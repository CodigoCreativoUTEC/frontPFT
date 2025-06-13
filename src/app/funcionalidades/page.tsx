"use client";
import React from "react";
import ListarFuncionalidades from "@/components/Paginas/Funcionalidades/Listar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const FuncionalidadesPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Funcionalidades" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5">
          <ListarFuncionalidades />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FuncionalidadesPage; 