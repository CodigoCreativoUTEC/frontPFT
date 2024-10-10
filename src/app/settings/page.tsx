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
      
        <Breadcrumb pageName="Profile" />
        <ReportPage />
      
    </DefaultLayout>
  );
};

export default Profile;