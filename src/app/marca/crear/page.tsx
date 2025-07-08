
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CrearMarca from "@/components/Paginas/Marcas/Crear";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "MAMED | Agregar marca",
};

const CrearMarcaPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Agregar marca" />
      <div className="flex flex-col gap-10">
        <CrearMarca />
      </div>
    </DefaultLayout>
  );
};

export default CrearMarcaPage; 