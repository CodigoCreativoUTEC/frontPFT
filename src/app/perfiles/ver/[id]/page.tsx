import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Ver from "@/components/Perfiles/Ver";
import { Metadata } from "@/components/Metadata/Metadata";

export const metadata: Metadata = {
  title: "MAMED | Detalle del Usuario",
};

const Ver = () => {
  return (
    <DefaultLayout>
            <Breadcrumb pageName="Detalle del Usuario" />
            <Ver />
    </DefaultLayout>
  );
}

export default Ver;