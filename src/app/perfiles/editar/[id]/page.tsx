import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import Editar from "@/components/Paginas/Perfiles/Editar";

export const metadata: Metadata = {
  title: "Editar Perfil",
};

const Ver = () => {
  return (
    <DefaultLayout>
            <Breadcrumb pageName="Edicion del Perfil" />
            <Editar />
    </DefaultLayout>
  );
}

export default Ver;