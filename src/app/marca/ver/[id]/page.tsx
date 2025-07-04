
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VerMarca from "@/components/Paginas/Marcas/Ver";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "MAMED | Detalle de marca",
};

const VerMarcaPage = ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Detalle de marca" />
      <div className="flex flex-col gap-10">
        <VerMarca id={id} />
      </div>
    </DefaultLayout>
  );
};

export default VerMarcaPage; 