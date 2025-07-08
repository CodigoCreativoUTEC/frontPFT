import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditarModelo from "@/components/Paginas/Modelos/Editar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "MAMED | Editar modelo",
};

const EditarModeloPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Editar modelo" />
      <div className="flex flex-col gap-10">
        <EditarModelo />
      </div>
    </DefaultLayout>
  );
};

export default EditarModeloPage; 