import React from "react";
import EditarIntervencion from "@/components/Paginas/Intervenciones/Editar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Intervención",
};

const EditarIntervencionPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Editar Intervención" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6.5">
            <h1 className="text-2xl font-bold mb-6">Editar Intervención</h1>
            <EditarIntervencion />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditarIntervencionPage; 