import ListarFuncionalidades from "@/components/Paginas/Funcionalidades/Listar";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funcionalidades",
};

const FuncionalidadesPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Funcionalidades" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <ListarFuncionalidades />
      </div>
    </DefaultLayout>
  );
};

export default FuncionalidadesPage; 