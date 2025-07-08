import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ListarEquipos from "@/components/Paginas/Equipos/Listar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "Listado de equipos",
};

const EquiposPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de equipos" />

      <div className="flex flex-col gap-10">
        <ListarEquipos />
      </div>
    </DefaultLayout>
  );
};

export default EquiposPage; 
