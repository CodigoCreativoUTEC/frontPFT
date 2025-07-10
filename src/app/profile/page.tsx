import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PerfilCompleto from "@/components/Paginas/Usuarios/PerfilCompleto";

export const metadata: Metadata = {
  title: "Mi perfil"
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Mi Perfil" />
        <div className="flex flex-col gap-10">
          <PerfilCompleto />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
