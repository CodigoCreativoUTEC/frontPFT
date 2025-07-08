import React from "react";
import VerEquipo from "@/components/Paginas/Equipos/Ver";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Helpers/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ver Equipo",
};

const VerEquipoPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Equipos", href: "/equipos" },
            { label: "Ver Equipo", href: "#" },
          ]}
        />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6.5">
            <h1 className="text-2xl font-bold mb-6">Detalles del Equipo</h1>
            <VerEquipo />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VerEquipoPage; 