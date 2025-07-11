import React from "react";
import VerIntervencion from "@/components/Paginas/Intervenciones/Ver";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ver Intervención",
};

const VerIntervencionPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Ver Intervención" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6.5">
            <h1 className="text-2xl font-bold mb-6">Detalles de la Intervención</h1>
            <VerIntervencion />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VerIntervencionPage; 