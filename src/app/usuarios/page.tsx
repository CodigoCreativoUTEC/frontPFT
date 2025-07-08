import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ListarUsuarios from "@/components/Paginas/Usuarios/Listar";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Listado de usuarios",
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