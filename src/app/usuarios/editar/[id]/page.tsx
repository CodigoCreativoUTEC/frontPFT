import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "@/components/Metadata/Metadata";
import UserEdit from "@/components/Usuarios/Editar";

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