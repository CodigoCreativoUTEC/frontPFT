import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ListarModelos from "@/components/Paginas/Modelos/Listar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "MAMED | Listado de modelos",
};

const ModeloPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de modelos" />
      <div className="flex flex-col gap-10">
        <ListarModelos />
      </div>
    </DefaultLayout>
  );
};

export default ModeloPage; 