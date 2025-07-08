import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VerModelo from "@/components/Paginas/Modelos/Ver";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "Detalle de modelo",
};

const VerModeloPage = () => (
  <DefaultLayout>
    <Breadcrumb pageName="Detalle de modelo" />
    <div className="flex flex-col gap-10">
      <VerModelo />
    </div>
  </DefaultLayout>
);

export default VerModeloPage; 