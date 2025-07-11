import CrearIntervencion from "@/components/Paginas/Intervenciones/Crear";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Creacion de Intervención",
};

const CrearIntervencionPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Creacion de Intervención" />
                <CrearIntervencion />
        </DefaultLayout>
    );
};

export default CrearIntervencionPage; 