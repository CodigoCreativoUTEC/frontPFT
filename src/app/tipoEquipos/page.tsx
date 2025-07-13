import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ListarTiposEquipos from "@/components/Paginas/TipoEquipos/Listar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "Listado de tipos de equipos",
};

const TipoEquiposPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de tipos de equipos" />

      <div className="flex flex-col gap-10">
        <ListarTiposEquipos />
      </div>
    </DefaultLayout>
  );
};

export default TipoEquiposPage; 