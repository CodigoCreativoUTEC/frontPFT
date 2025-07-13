import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditarModelo from "@/components/Paginas/Modelos/Editar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "Editar modelo",
};

const EditarModeloPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Editar modelo" />
      <div className="flex flex-col gap-2">
        <EditarModelo />
      </div>
    </DefaultLayout>
  );
};

export default EditarModeloPage; 