"use-client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";
import ListarUsuarios from "@/components/Usuarios/Listar";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "MAMED | Listado de usuarios",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de usuarios" />

      <div className="flex flex-col gap-10">
        <ListarUsuarios />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
