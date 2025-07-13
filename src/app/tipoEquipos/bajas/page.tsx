import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ListarBajasTiposEquipos from "@/components/Paginas/TipoEquipos/ListarBajas";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipos de Equipos Inactivos",
};

const BajasTiposEquiposPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tipos de Equipos Inactivos" />

      <div className="flex flex-col gap-10">
        <ListarBajasTiposEquipos />
      </div>
    </DefaultLayout>
  );
};

export default BajasTiposEquiposPage; 