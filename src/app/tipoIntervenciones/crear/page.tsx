import CrearTipoIntervencion from "@/components/Paginas/TiposIntervenciones/Crear";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Crear Tipo de Intervención",
};

const CrearTipoIntervencionPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Crear Tipo de Intervención" />
                <CrearTipoIntervencion />
        </DefaultLayout>
    );
};

export default CrearTipoIntervencionPage; 