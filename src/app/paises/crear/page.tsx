import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CrearPais from "@/components/Paginas/Paises/Crear";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "MAMED | Agregar país",
};

const CrearPaisPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Agregar país" />
      <div className="flex flex-col gap-10">
        <CrearPais />
      </div>
    </DefaultLayout>
  );
};

export default CrearPaisPage; 