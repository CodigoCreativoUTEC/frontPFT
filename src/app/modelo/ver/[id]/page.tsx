import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VerModelo from "@/components/Paginas/Modelos/Ver";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata = {
  title: "MAMED | Detalle de modelo",
};

const VerModeloPage = ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Detalle de modelo" />
      <div className="flex flex-col gap-10">
        <VerModelo id={id} />
      </div>
    </DefaultLayout>
  );
};

export default VerModeloPage; 