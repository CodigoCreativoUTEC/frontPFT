import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditarPais from "@/components/Paginas/Paises/Editar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "MAMED | Editar país",
};

const EditarPaisPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Editar país" />
      <div className="flex flex-col gap-10">
        <EditarPais />
      </div>
    </DefaultLayout>
  );
};

export default EditarPaisPage; 