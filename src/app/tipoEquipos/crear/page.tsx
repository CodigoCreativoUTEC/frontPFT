import CrearTipoEquipo from "@/components/Paginas/TipoEquipos/Crear";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Creación de Tipo de Equipo",
};

const CrearTipoEquipoPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Creación de Tipo de Equipo" />
                <CrearTipoEquipo />
        </DefaultLayout>
    );
};

export default CrearTipoEquipoPage; 