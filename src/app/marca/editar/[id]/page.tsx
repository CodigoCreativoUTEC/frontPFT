import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EditarMarca from "@/components/Paginas/Marcas/Editar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "Editar marca",
};

const EditarMarcaPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Editar marca" />
      <div className="flex flex-col gap-10">
        <EditarMarca />
      </div>
    </DefaultLayout>
  );
};

export default EditarMarcaPage; 