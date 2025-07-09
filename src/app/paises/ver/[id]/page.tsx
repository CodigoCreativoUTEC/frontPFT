import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VerPais from "@/components/Paginas/Paises/Ver";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "Detalle de país",
};

const VerPaisPage = () => (
  <DefaultLayout>
    <Breadcrumb pageName="Detalle de país" />
    <div className="flex flex-col gap-10">
      <VerPais />
    </div>
  </DefaultLayout>
);

export default VerPaisPage; 