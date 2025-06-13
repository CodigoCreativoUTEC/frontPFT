import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VerUsuario from "@/components/Paginas/Usuarios/Ver";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAMED | Detalle del Usuario",
};

const Ver = () => {
  return (
    <DefaultLayout>
            <Breadcrumb pageName="Detalle del Usuario" />
            <VerUsuario />
    </DefaultLayout>
  );
}

export default Ver;