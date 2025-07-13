import VerFuncionalidad from "@/components/Paginas/Funcionalidades/Ver";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function VerFuncionalidadPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Ver Funcionalidad" />
      <VerFuncionalidad />
    </DefaultLayout>
  );
} 