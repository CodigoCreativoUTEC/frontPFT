import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ListarTiposIntervenciones from "@/components/Paginas/TiposIntervenciones/Listar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "Tipos de Intervenciones",
};

const TiposIntervencionesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tipos de Intervenciones" />

      <div className="flex flex-col gap-10">
        <ListarTiposIntervenciones />
      </div>
    </DefaultLayout>
  );
};

export default TiposIntervencionesPage; 