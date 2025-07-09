import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ListarPaises from "@/components/Paginas/Paises/Listar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "Listado de países",
};

const PaisesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de países" />
      <div className="flex flex-col gap-10">
        <ListarPaises />
      </div>
    </DefaultLayout>
  );
};

export default PaisesPage; 