
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ListarMarcas from "@/components/Paginas/Marcas/Listar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "MAMED | Listado de marcas",
};

const MarcaPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de marcas" />
      <div className="flex flex-col gap-10">
        <ListarMarcas />
      </div>
    </DefaultLayout>
  );
};

export default MarcaPage; 