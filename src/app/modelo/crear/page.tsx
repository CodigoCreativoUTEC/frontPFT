import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CrearModelo from "@/components/Paginas/Modelos/Crear";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "MAMED | Agregar modelo",
};

const CrearModeloPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Agregar modelo" />
      <div className="flex flex-col gap-10">
        <CrearModelo />
      </div>
    </DefaultLayout>
  );
};

export default CrearModeloPage; 