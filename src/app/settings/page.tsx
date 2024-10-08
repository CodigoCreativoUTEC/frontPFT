import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import ReportPage from "@/components/Tables/tabla";

export const metadata: Metadata = {
  title: "MAMED - Editar mis datos",
  description:
    "Pagina para editar los datos del usuario ingresado",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Profile" />
        <ReportPage />
      </div>
    </DefaultLayout>
  );
};

export default Profile;