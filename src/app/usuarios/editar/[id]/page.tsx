import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import UserEdit from "@/components/Paginas/Usuarios/Editar";

export const metadata: Metadata = {
  title: "MAMED | Editar Usuario",
};

const Ver = () => {
  return (
    <DefaultLayout>
            <Breadcrumb pageName="Edicion del Usuario" />
            <UserEdit />
    </DefaultLayout>
  );
}

export default Ver;