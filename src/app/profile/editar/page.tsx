import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditarPerfil from "@/components/Paginas/Usuarios/EditarPerfil";

export const metadata: Metadata = {
  title: "Editar Mi Perfil",
  description: "Editar información del perfil personal"
};

const EditarPerfilPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Editar Mi Perfil" />
      <div className="flex flex-col gap-10">
        <EditarPerfil />
      </div>
    </DefaultLayout>
  );
};

export default EditarPerfilPage; 